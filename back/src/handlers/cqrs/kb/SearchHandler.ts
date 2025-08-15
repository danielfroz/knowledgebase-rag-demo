import { SearchQuery, SearchQueryResult } from "@/models/cqrs/kb";
import { Types } from "@/types";
import { DI, Errors, QueryHandler } from "@danielfroz/sloth";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { VoyageAIClient } from "voyageai";

const template = "You are an agent which responds to the user's question with the information provided from multiple sources.\n"+
  "Uses the context information I gave you to answer the user, providing him examples if necessary.\n"+
  "In case you can\'t find enough information from the context, tell the user that you don\'t have"+
  " answer at this moment and that your knowledge needs to be improved and that the user can help.\n"+
  "Don\'t use any other information not explicitly passed from the context.\n"+
  "Note that the context information is formatted in JSON. Also the information is available under the .text field\n"+
  "You may mention the source of information from the field .source.name\n"+
  "You shall respond using Markdown format.\n"+
  "\n"+
  "Question={question}\n"+
  "Context={context}\n"
  //  Adds a extra space to keep a nice answer format.\n"+

export class SearchHandler implements QueryHandler<SearchQuery, SearchQueryResult> {
  constructor(
    private readonly config = DI.inject(Types.Config),
    private readonly rc = DI.inject(Types.Repos.Chunk),
    private readonly log = DI.inject(Types.Log)
  ) {}

  async handle(query: SearchQuery): Promise<SearchQueryResult> {
    if(!query)
      throw new Errors.ArgumentError('query')
    if(!query.question)
      throw new Errors.ArgumentError('query.query')

    const { id, sid, question, rerank } = query

    const log = this.log.child({ mod: 'kb.source.search', sid })

    log.info({ msg: `initializing search`, question })

    const stats = {
      embedding: {
        start: 0,
        stop: 0,
        elapsed: 0
      },
      atlas: {
        start: 0,
        stop: 0,
        elapsed: 0
      },
      rerank: {
        start: 0,
        stop: 0,
        elapsed: 0,
      },
      llm: {
        start: 0,
        stop: 0,
        elapsed: 0
      }
    }

    stats.embedding.start = Date.now()
    const client = new VoyageAIClient({ apiKey: this.config.voyageai.key })
    const res = await client.embed({ 
      input: question,
      model: 'voyage-3-large',
      inputType: 'query'
    })
    stats.embedding.stop = Date.now()
    stats.embedding.elapsed = stats.embedding.stop - stats.embedding.start

    const queryVector = res.data && res.data[0] && res.data[0].embedding
    if(!queryVector) {
      log.error({ msg: `failed to create vector query` })
      return {
        id,
        sid,
        answer: 'Failed to create vector query'
      }
    }

    stats.atlas.start = Date.now()
    const chunks = await this.rc.search({ queryVector })
    stats.atlas.stop = Date.now()
    stats.atlas.elapsed = stats.atlas.stop - stats.atlas.start

    if(chunks && rerank) {
      stats.rerank.start = Date.now()
      // reranking if due
      const rrres = await client.rerank({
        query: question,
        documents: chunks.map(x => x.text),
        model: 'rerank-2'
      })
      if(rrres.data) {
        for(const result of rrres.data) {
          if(!result.index)
            continue
          const chunk = chunks.at(result.index)
          if(!chunk)
            continue
          chunk.relevanceScore = result.relevanceScore
        }
        // sort based on score
        chunks.sort((a, b) => {
          if(!a.relevanceScore || !b.relevanceScore)
            return 0
          if(a.relevanceScore > b.relevanceScore)
            return 1
          if(a.relevanceScore < b.relevanceScore)
            return -1
          return 0
        })
      }
      stats.rerank.stop = Date.now()
      stats.rerank.elapsed = stats.rerank.stop - stats.rerank.start
    }

    const prompt = new PromptTemplate({
      template,
      inputVariables: [
        "question",
        "context",
      ]
    })

    stats.llm.start = Date.now()
    const llm = new ChatOpenAI({
      openAIApiKey: this.config.openai.key,
      model: this.config.openai.models.chat ?? 'gpt-4o-mini'
    })
    const llmres = await prompt.pipe(llm).invoke({
      question,
      context: chunks ? JSON.stringify(chunks?.map(x => ({ id: x.id, text: x.text }))): '[]'
    })
    const answer = llmres.content.toString()
    stats.llm.stop = Date.now()
    stats.llm.elapsed = stats.llm.stop - stats.llm.start

    log.info({
      msg: `answering question`, 
      stats: {
        embedding: `${stats.embedding.elapsed}ms`,
        atlas: `${stats.atlas.elapsed}ms`,
        rerank: `${stats.rerank.elapsed}ms`,
        llm: `${stats.llm.elapsed}ms`,
      },
    })

    return {
      id,
      sid,
      answer
    }
  }
}
import { AddCommand, AddCommandResult } from "@/models/cqrs/kb";
import { Chunk, Source } from "@/models/dtos/kb";
import { Types } from "@/types";
import { CommandHandler, DI, Errors } from "@danielfroz/sloth";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import * as fs from 'fs';
import pdf from 'pdf-parse';
import { VoyageAIClient } from "voyageai";

export class AddHandler implements CommandHandler<AddCommand, AddCommandResult> {
  constructor(
    private readonly config = DI.inject(Types.Config),
    private readonly rc = DI.inject(Types.Repos.Chunk),
    private readonly rs = DI.inject(Types.Repos.Source),
    private readonly log = DI.inject(Types.Log)
  ) {}

  async handle(cmd: AddCommand): Promise<AddCommandResult> {
    if(!cmd)
      throw new Errors.ArgumentError('cmd')
    if(!cmd.source)
      throw new Errors.ArgumentError('cmd.source')

    const { id, sid, source: csource } = cmd

    const log = this.log.child({ mod: 'kb.source.add', sid })

    // check if file exists
    if(!fs.existsSync(csource.path)) {
      throw new Errors.CodeDescriptionError(
        'path.invalid',
        `failed to locate file`,
        `failed to locate file: ${csource.path}`
      )
    }

    // create the indexes if necessary
    await this.rc.indexes()

    // check if this source is not already processed
    const existing = await this.rs.get({ id: csource.id })
    if(existing) {
      log.warn({ msg: `source already exists; discarding this add request` })
      return {
        id,
        sid
      }
    }

    this._process({
      id: csource.id,
      created: new Date(),
      name: csource.name,
      path: csource.path,
    })

    return {
      id,
      sid,
    }
  }

  async _process(source: Source): Promise<void> {
    const log = this.log.child({ mod: 'kb.source.add@_process' })

    log.info({ msg: `running processing assynchronously` })

    const existing = await this.rs.get({ id: source.id })
    if(existing) {
      log.warn({ msg: `source already exists; discarding this add request; done with processing` })
      return
    }

    await this.rs.save({ source })

    log.info({ msg: `source saved` })

    const dataBuffer = fs.readFileSync(source.path)
    const data = await pdf(dataBuffer)

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 8000,
      chunkOverlap: 1000,
    })

    const client = new VoyageAIClient({ apiKey: this.config.voyageai.key })

    let chunkCount = 1
    const chunks = await splitter.splitText(data.text)
    for(const text of chunks) {
      const chunk = {
        id: crypto.randomUUID(),
        source: {
          id: source.id,
          name: source.name,
        },
        text,
        embeddings: undefined
      } as Chunk

      const resp = await client.embed({
        input: text,
        model: 'voyage-3-large',
        inputType: 'document'
      })

      if(resp.data && resp.data[0]) {
        chunk.embeddings = resp.data[0].embedding
      }

      await this.rc.save({ chunk })

      // saving source again with chunks information...
      await this.rs.updateChunks({
        id: source.id,
        chunks: {
          processed: chunkCount,
          total: chunks.length
        }
      })

      log.info({ msg: `saved chunk ${chunkCount++} of ${chunks.length}` })
    }

    log.info({ msg: 'processing done' })
  }
}
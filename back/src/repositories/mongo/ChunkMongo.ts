import { Chunk } from "@/models/dtos/kb";
import { ChunkRepository } from "@/repositories";
import { Types } from "@/types";
import { Log } from "@danielfroz/slog";
import { DI, Errors } from "@danielfroz/sloth";
import { Collection } from "mongodb";

const SEARCH_INDEX_NAME = 'embeddings'

export class ChunkMongo implements ChunkRepository {
  private readonly coll: Collection<Chunk>
  private readonly log: Log

  constructor(
    db = DI.inject(Types.Repos.Database),
    log = DI.inject(Types.Log),
  ) {
    this.coll = db.collection<Chunk>('chunk')
    this.log = log.child({ mod: 'repos.mongo.chunk' })
  }

  async delete(args: ChunkRepository.Delete): Promise<void> {
    if(!args)
      throw new Errors.ArgumentError('args')

    const { id, source } = args
    if(id) {
      await this.coll.deleteOne({ id })
    }
    else if(source) {
      await this.coll.deleteMany({ 'source.id': source })
    }
  }

  async get(args: ChunkRepository.Get): Promise<Chunk | undefined> {
    if (!args)
      throw new Errors.ArgumentError('args')
    if (!args.id)
      throw new Errors.ArgumentError('args.id')

    const { id } = args

    return await this.coll.findOne({ id }) || undefined
  }

  /**
   * Create indexes if does not exist
   */
  async indexes(): Promise<void> {
    this.log.info({ msg: 'creating the doc indexes' })
    await this.coll.createIndex({ id: 1, created: 1 })
    // important for the delete operation by source.id
    await this.coll.createIndex({ 'source.id': 1 })

    const searchIndexes = new Set<string>()
    const curs = this.coll.listSearchIndexes()
    try {
      while(await curs.hasNext()) {
        const doc = await curs.next()
        if(!doc)
          break
        searchIndexes.add(doc.name)
      }
    }
    finally {
      await curs.close()
    }

    if(!searchIndexes.has(SEARCH_INDEX_NAME)) {
      this.log.info({ msg: `creating vector search index: ${SEARCH_INDEX_NAME}` })
      await this.coll.createSearchIndex({
        name: SEARCH_INDEX_NAME,
        type: 'vectorSearch',
        definition: {
          fields: [
            {
              type: 'vector',
              path: 'embeddings',
              numDimensions: 1024,
              similarity: 'dotProduct'
            }
          ]
        }
      })
    }
  }

  async save(args: ChunkRepository.Save): Promise<void> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.chunk)
      throw new Errors.ArgumentError('args.chunk')
    if(!args.chunk.id)
      throw new Errors.ArgumentError('args.chunk.id')
    if(!args.chunk.source)
      throw new Errors.ArgumentError('args.chunk.source')

    const { chunk } = args

    const doc = chunk

    await this.coll.replaceOne({ id: doc.id }, doc, { upsert: true })
  }

  async search(args: ChunkRepository.Search): Promise<Chunk[] | undefined> {
    if (!args)
      throw new Errors.ArgumentError('args')
    if (!args.queryVector)
      throw new Errors.ArgumentError('args.queryVector')

    const { queryVector } = args

    const cur = this.coll.aggregate<Chunk>([
      {
        $vectorSearch: {
          index: SEARCH_INDEX_NAME,
          path: 'embeddings',
          queryVector: queryVector,
          numCandidates: 200,
          limit: 20,
        }
      },
      {
        $addFields: {
          score: {
            $meta: 'vectorSearchScore'
          }
        }
      },
      {
        $project: {
          _id: 1,
          id: 1,
          source: 1,
          text: 1,
          score: 1,
        }
      }
    ])
    try {
      return await cur.toArray() || undefined
    }
    finally {
      await cur.close()
    }
  }
}
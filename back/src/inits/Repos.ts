import { ChunkMongo, SourceMongo } from "@/repositories/mongo"
import { Types } from "@/types"
import { container } from "@danielfroz/sloth"
import { MongoClient, MongoError } from "mongodb"

export const init = async () => {
  const clog = container.resolve(Types.Log)
  const log = clog.child({ mod: 'Repos.init' })

  try {
    const config = container.resolve(Types.Config)

    log.info({ msg: `connecting to mongo: ${config.mongo.uri}` })

    const client = new MongoClient(config.mongo.uri)
    await client.connect()

    log.info({ msg: 'connected to cluster' })

    const kbDb = client.db('knowledgebase')
    container.register(Types.Repos.Database, { useValue: kbDb })
    container.register(Types.Repos.Chunk, { useClass: ChunkMongo })
    container.register(Types.Repos.Source, { useClass: SourceMongo })
  }
  catch (error: Error | MongoError | any) {
    log.error({ msg: `failed to initialize mongo connection`, error })
    process.exit(-1)
  }
}
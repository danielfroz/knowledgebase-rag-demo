import { Source } from "@/models/dtos/kb";
import { SourceRepository } from "@/repositories";
import { Types } from "@/types";
import { DI, Errors } from "@danielfroz/sloth";
import { Collection } from "mongodb";

const COLLECTION = 'source'

export class SourceMongo implements SourceRepository {
  private readonly coll: Collection<Source>

  constructor(
    readonly db = DI.inject(Types.Repos.Database)
  ) {
    this.coll = db.collection<Source>(COLLECTION)
  }

  private _doc(source: Source): any {
    if(!source)
      return undefined
    return {
      id: source.id,
      created: source.created ? new Date(source.created): undefined,
      name: source.name
    }
  }

  async delete(args: SourceRepository.Delete): Promise<void> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.id)
      throw new Errors.ArgumentError('args.id')
    const { id } = args
    await this.coll.deleteOne({ id })
  }

  async get(args: SourceRepository.Get): Promise<Source | undefined> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.id)
      throw new Errors.ArgumentError('args.id')
    const { id } = args
    return await this.coll.findOne({ id }) || undefined
  }

  async list(): Promise<Source[] | undefined> {
    const cur = this.coll.find({}).sort({ _id: 1 })
    try {
      return await cur.toArray() || undefined
    }
    finally {
      await cur.close()
    }
  }

  async save(args: SourceRepository.Save): Promise<void> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.source)
      throw new Errors.ArgumentError('args.source')
    if(!args.source.id)
      throw new Errors.ArgumentError('args.source.id')

    const { source } = args
    const doc = this._doc(source)
    await this.coll.replaceOne({ id: doc.id }, doc, { upsert: true })
  }

  async updateChunks(args: SourceRepository.UpdateChunks): Promise<void> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.id)
      throw new Errors.ArgumentError('args.id')
    const { id, chunks } = args
    await this.coll.updateOne({ id },
      {
        $set: { chunks }
      })
  }
}
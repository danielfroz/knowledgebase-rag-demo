import { ListQuery, ListQueryResult } from "@/models/cqrs/kb";
import { Types } from "@/types";
import { DI, Errors, QueryHandler } from "@danielfroz/sloth";

export class ListHandler implements QueryHandler<ListQuery, ListQueryResult> {
  constructor(
    private readonly rs = DI.inject(Types.Repos.Source),
    private readonly log = DI.inject(Types.Log)
  ) {}

  async handle(query: ListQuery): Promise<ListQueryResult> {
    if(!query)
      throw new Errors.ArgumentError('query')
    if(!query.id)
      throw new Errors.ArgumentError('query.id')

    const { id, sid } = query

    const log = this.log.child({ mod: 'kb.source.list' })

    const sources = await this.rs.list()

    log.info({ msg: `listed sources`, sources: sources?.map(x => x.id).join(',') })

    return {
      id,
      sid,
      sources
    }
  }
}
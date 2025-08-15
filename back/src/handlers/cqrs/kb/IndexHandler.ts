import { IndexCommand, IndexCommandResult } from "@/models/cqrs/kb";
import { Types } from "@/types";
import { CommandHandler, DI, Errors } from "@danielfroz/sloth";

export class IndexHandler implements CommandHandler<IndexCommand, IndexCommandResult> {
  constructor(
    private readonly rc = DI.inject(Types.Repos.Chunk),
    private readonly log = DI.inject(Types.Log)
  ) {}

  async handle(cmd: IndexCommand): Promise<IndexCommandResult> {
    if(!cmd)
      throw new Errors.ArgumentError('cmd')
    if(!cmd.id)
      throw new Errors.ArgumentError('cmd.id')
    if(!cmd.sid)
      throw new Errors.ArgumentError('cmd.sid')

    const { id, sid } = cmd

    const log = this.log.child({ mod: 'source.index', sid })

    await this.rc.indexes()

    log.info({ msg: 'indexes created'})

    return {
      id,
      sid
    }
  }
}
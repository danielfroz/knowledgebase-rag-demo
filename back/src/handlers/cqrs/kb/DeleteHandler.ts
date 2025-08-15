import { DeleteCommand, DeleteCommandResult } from "@/models/cqrs/kb";
import { Types } from "@/types";
import { CommandHandler, DI, Errors } from "@danielfroz/sloth";

export class DeleteHandler implements CommandHandler<DeleteCommand, DeleteCommandResult> {
  constructor(
    private readonly rc = DI.inject(Types.Repos.Chunk),
    private readonly rs = DI.inject(Types.Repos.Source),
    private readonly log = DI.inject(Types.Log),
  ) {}

  async handle(cmd: DeleteCommand): Promise<DeleteCommandResult> {
    const { id, sid, source: sourceId } = cmd

    const log = this.log.child({ mod: 'kb.source.delete', sid })

    const source = await this.rs.get({ id: sourceId })
    if(!source) {
      throw new Errors.ArgumentError('cmd.source.invalid')
    }

    await this.rc.delete({ source: source.id })
    await this.rs.delete({ id: source.id })

    log.info({ msg: `deleted source: ${source.id} / ${source.name}` })

    return {
      id,
      sid
    }
  }
}
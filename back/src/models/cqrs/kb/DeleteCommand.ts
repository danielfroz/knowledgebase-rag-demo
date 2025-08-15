import { Command, CommandResult } from "@danielfroz/sloth";

export interface DeleteCommand extends Command {
  source: string
}

export interface DeleteCommandResult extends CommandResult {
}
import { Command, CommandResult } from "@danielfroz/sloth";

export interface AddCommand extends Command {
  source: {
    id: string
    name: string
    path: string
  }
}

export interface AddCommandResult extends CommandResult {
}
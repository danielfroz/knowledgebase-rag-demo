import { Log } from '@danielfroz/slog'
import { DI } from '@danielfroz/sloth'
import { Db } from 'mongodb'
import { Config } from './models/dtos'
import * as Repos from './repositories'

export const Types = {
  Config: DI.Type<Config>('Config'),
  Log: DI.Type<Log>('Log'),
  Repos: {
    Database: DI.Type<Db>('Repos.Kb.Database'),
    Chunk: DI.Type<Repos.ChunkRepository>('Repos.Kb.Chunk'),
    Source: DI.Type<Repos.SourceRepository>('Repos.Kb.Source')
  },
}
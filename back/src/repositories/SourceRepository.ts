import { Source } from "@/models/dtos/kb";

export interface SourceRepository {
  delete(args: SourceRepository.Delete): Promise<void>
  get(args: SourceRepository.Get): Promise<Source | undefined>
  list(): Promise<Source[] | undefined>
  save(args: SourceRepository.Save): Promise<void>
  updateChunks(args: SourceRepository.UpdateChunks): Promise<void>
}

export namespace SourceRepository {
  export interface Delete {
    id: string
  }

  export interface Get {
    id: string
  }

  export interface Save {
    source: Source
  }

  export interface UpdateChunks {
    id: string
    chunks?: {
      processed: number
      total: number
    }
  }
}
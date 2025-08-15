import { Chunk } from "@/models/dtos/kb"

export interface ChunkRepository {
  delete(args: ChunkRepository.Delete): Promise<void>
  get(args: ChunkRepository.Get): Promise<Chunk | undefined>
  indexes(): Promise<void>
  save(args: ChunkRepository.Save): Promise<void>
  search(args: ChunkRepository.Search): Promise<Chunk[]|undefined>
}

export namespace ChunkRepository {
  export interface Delete {
    id?: string
    source?: string
  }

  export interface Get {
    id: string
  }

  export interface Save {
    chunk: Chunk
  }

  export interface Search {
    queryVector: number[]
  }
}
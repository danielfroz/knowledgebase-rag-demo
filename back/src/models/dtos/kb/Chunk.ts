export interface Chunk {
  id: string
  source: {
    id: string
    name: string
  }
  text: string
  embeddings?: number[]
  score?: number
  relevanceScore?: number
}
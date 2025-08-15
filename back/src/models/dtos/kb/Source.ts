export interface Source {
  created: Date|string
  id: string
  name: string
  path: string
  chunks?: {
    processed: number
    total: number
  }
}
export interface Config {
  mongo: {
    uri: string
  }
  openai: {
    key: string
    models: {
      embedding: string
      chat: string
    }
  },
  voyageai: {
    key: string
  }
}
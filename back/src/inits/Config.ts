import { Config } from '@/models/dtos'
import { Types } from '@/types'
import { container } from '@danielfroz/sloth'
import fs from 'fs'
import { parse } from 'yaml'

export const init = async () => {
  let filePath = undefined
  const configFilePaths = [
    './config.local.yml',
    '../config.local.yml',
    './config.yml',
    '../config.yml'
  ]
  for (const cp of configFilePaths) {
    if (!fs.existsSync(cp))
      continue
    const stat = fs.statSync(cp)
    if (stat.isFile()) {
      filePath = cp
      break
    }
  }
  if (!filePath) {
    throw new Error('invalid configuration file')
  }
  const file = fs.readFileSync(filePath, 'utf-8')
  try {
    const config = parse(file) as Config
    if (!config.mongo)
      throw new Error('config.mongo')
    if (!config.mongo.uri)
      throw new Error('config.mongo.uri')

    if (!config.openai)
      throw new Error('config.openai')
    if (!config.openai.key)
      throw new Error('config.openai.key')
    if (!config.openai.models.embedding)
      throw new Error('config.openai.models.embedding')
    if (!config.openai.models.chat)
      throw new Error('config.openai.models.chat')

    if(!config.voyageai)
      throw new Error('config.voyageai')
    if(!config.voyageai.key)
      throw new Error('config.voyageai.key')

    container.register(Types.Config, { useValue: config })
  }
  catch (error: Error | any) {
    throw new Error(`failed to parse configuration file: ${error.message}`)
  }
}
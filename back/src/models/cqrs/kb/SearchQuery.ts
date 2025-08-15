import { Query, QueryResult } from "@danielfroz/sloth";

export interface SearchQuery extends Query {
  question: string
  rerank?: boolean
}

export interface SearchQueryResult extends QueryResult {
  answer?: string
}
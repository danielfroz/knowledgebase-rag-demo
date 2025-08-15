import { Source } from "@/models/dtos/kb";
import { Query, QueryResult } from "@danielfroz/sloth";

export interface ListQuery extends Query {
}

export interface ListQueryResult extends QueryResult {
  sources?: Source[]
}
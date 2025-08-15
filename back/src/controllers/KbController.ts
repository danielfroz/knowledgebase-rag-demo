import {
  AddHandler,
  DeleteHandler,
  IndexHandler,
  ListHandler,
  SearchHandler
} from "@/handlers/cqrs/kb";
import { Controller } from "@danielfroz/sloth";

export const KbController = new Controller('/kb')
  .add({
    endpoint: '/add',
    handler: AddHandler
  })
  .add({
    endpoint: '/delete',
    handler: DeleteHandler
  })
  .add({
    endpoint: '/list',
    handler: ListHandler
  })
  .add({
    endpoint: '/index',
    handler: IndexHandler
  })
  .add({
    endpoint: '/search',
    handler: SearchHandler
  })
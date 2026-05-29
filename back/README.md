# Introduction

Backend service supporting the RAG implementation and MongoDB Atlas integration
as well as Voyage AI.

# Code Structure

- Controllers - Responsible for the API endpoints implementation and definition.

- Handlers - RAG implementation layer. At this layer you can see the integration
  with LangChain, Voyage AI and MongoDB Atlas Vector Search.

- Inits - service initialization functions. Code organization following the
  standard implementation from Sloth framework.

- Models - interfaces and classes definitions; DTOs and CQRS

- Repositories - Persistence implementation layer

# Running

## Developer mode

Do the basic npm install and run... Install node.js prior to run the commands
below:

```shell
npm install
sh ./dev.sh
```

## Docker mode

Do the docker build from the parent directory using docker|podman compose.

```shell
podman compose up -d
```

Use docker if you prefer.

# Building the indexes

Before searching, the MongoDB Atlas indexes must be created — including the
`embeddings` vector search index used by Atlas Vector Search. Call the `/kb/index`
endpoint once after the service is up (default port `4000`).

The request body requires an `id` and a `sid` (any values will do):

```shell
curl http://localhost:4000/kb/index \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"id":"1","sid":"1"}'
```

This is idempotent — the vector search index is only created if it does not
already exist. Note that on Atlas the search index builds asynchronously, so it
may take a short while before queries return results.

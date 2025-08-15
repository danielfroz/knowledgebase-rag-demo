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

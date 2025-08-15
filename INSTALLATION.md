# Installation on Atlas Cloud

## Prerequisites

The solution is containerized and can be easily installed/configured using Docker or Podman. 

In case you want to use Docker, adapt the commands replacing podman binary with docker (just replace the name `podman` with `docker` on each command). Same applies to Windows users, adapt commands as necessary.

## Build

Here are the steps to build and start the service.

1. Configuration

Edit the `config.yml` file and replace with your credentials. 
Update the MongoDB Atlas Connection String, OpenAI API key and the Voyage AI key.
If you do not have an OpenAI API key, create one.
If you do not have a Voyage AI key, create one - there is a limit for free usage. For this Demo, the free tokens available when you signup will serve you well.

Ps: you may want to use a local copy of the config.yml file with your keys. copy it and rename to `config.local.yml` - git ignore will miss any keys if you're planning to send a PR ;-)

2. Build the Code

Open the Terminal application and go to the directory where you cloned the repo or downloaded the files. Then, execute the following command:

```shell
$ podman compose build
```

3. Start the service

To start the service, execute the following command:

```shell
$ podman compose up -d
```

If you want you can run the dev.sh scripts instead. See the `README.md` from each component (back and front) for more instructions.

4. Create the indexes

Execute the following code to create the supporting indexes (Vector Search Index and Collection indexes)

```shell
curl -X POST -H "Content-Type: application/json" -d '{ "id": 1, "sid": 1 }'  http://localhost:4000/kb/index
```

4. Use the service

Open your web browser and go to the following address: http://localhost:3000

# Problems & Troubleshooting

If you encounter errors or if the backend service takes a long time to start, you may have an invalid connection string or have not configured your Atlas cluster to accept connections from your computer. 

Ensure that your _Network Access_ settings in your Atlas project allow connections from your current IP address.

**Note**: Be aware that VPNs can rotate IP addresses, potentially causing network delays or timeouts after several days of testing. Regularly check and update your Network Access settings.
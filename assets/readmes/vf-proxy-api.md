# VF Proxy API

This is a Bun application that serves as a proxy to use Voiceflow Dialog API and update agent's variables on client side. The application uses fastify for server/routes setup.
The main goal is to provide an endpoint you can use from the client side (webpage, chat widget script) without sharing your Voiceflow API key.

## Setup

1. Clone this repository:

```bash
git clone https://github.com/voiceflow-gallagan/vf-proxy-api.git
cd vf-proxy-api
```

2. For Local/Dev only (you don't need this if you want to use Docker)
   Install Bun and dependencies:

```bash
curl -fsSL https://bun.sh/install | bash
bun install
```

3. Copy the `.env.template` file or create a new `.env` file:

```bash
cp .env.template .env
```

4. Edit the `.env` file with your own Voiceflow API keys, as well as any other configurations you want to modify.

## Environment Variables

The application uses the following environment variables which are stored in a `.env` file:

- `VOICEFLOW_API_KEY`: Voiceflow API Key
- `VOICEFLOW_ENDPOINT`: https://general-runtime.voiceflow.com # Default DM API Endpoint
- `LOGGER`: true (to enable logging) or false
- `RATE_LIMIT`: Number of request per time window
- `RATE_LIMIT_WINDOW`: Time window in seconds
- `RETURN_RESPONSE`: true to return the response from the Voiceflow API, false to return only status code (without the variables values)
- `PORT`: Port to run the server on


## Usage

### Run/Test locally

```bash
bun run app
```

### Docker

To simplify the process, we are providing the Dockerfile and docker-compose file to build the Bun image and run the application.

```bash
bun run docker-start
```

### API Endpoints

- `GET /api/health`: Used to check if the server is running (healthcheck)

- `PATCH /api/variables/:userID`: Patch the variables from the body payload for the given userID

  Body payload example:

  ```json
  {
    "variable_name": "voiceflow",
    "username": "Niko"
  }
  ```

  Variables should already exist in your Voiceflow agent to be succefuly updated.



## Voiceflow Discord

We can talk about this project on Discord
https://discord.gg/9JRv5buT39


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_vf-proxy-api&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_vf-proxy-api)


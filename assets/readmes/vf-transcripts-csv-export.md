# VF Transcripts CSV Export

This project is a parser/csv exporter for Voiceflow agent transcripts, designed to fetch and process transcripts data using the Voiceflow Transcripts API.

## Setup

### Prerequisites

- **Bun**: This project uses Bun as the JavaScript runtime. You can install Bun by following the instructions on their [official documentation](https://bun.sh/docs).
  - **Only for local testing - not needed for [Docker setup](#docker-setup)**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/vf-transcripts-csv-export.git
   cd vf-transcripts-csv-export
   ```

2. **Install dependencies** (only for local testing - **not needed for Docker setup**):
   ```bash
   bun install
   ```

3. **Environment Variables**:
   Create a `.env` file (or copy,rename and edit the `.env.example` one) in the root directory with the following variables:

   ```plaintext
   API_BASE_URL=https://api.voiceflow.com/v2
   PROJECT_ID=your_project_id
   VF_API_KEY=VF.DM.your_voiceflow_api_key
   AUTHORIZATION_TOKEN=your_authorization_token
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=10
   DELAY=50
   TIMEOUT=5m
   EXTRA_LOGS=false
   REDACT_API_URL=http://localhost:5005/redact
   USE_REDACT=false
   PORT=3000
   ```

   - `API_BASE_URL`: The **base URL** for the Voiceflow API.
   - `PROJECT_ID`: Your **project ID** from Voiceflow.
   - `VF_API_KEY`: Your **Voiceflow API key**.
   - `AUTHORIZATION_TOKEN`: A token for securing API requests.
   - `RATE_LIMIT_WINDOW_MS`: Rate **limit window** in milliseconds.
   - `RATE_LIMIT_MAX_REQUESTS`: Rate **limit max requests**.
   - `DELAY`: **Delay** between requests to Transcripts API in milliseconds.
   - `TIMEOUT`: **Timeout** in minutes for the /export endpoint.
   - `EXTRA_LOGS`: Enable extra logs.
   - `REDACT_API_URL`: **URL** for the SpaCy redaction API.
   - `USE_REDACT`: Set to **true** to use the SpaCy redaction API.
   - `PORT`: **Port** to run the server on.

   **Note**: The SpaCy redaction API is optional and can be used to redact PII from the transcripts.
   Check the [SpaCy redaction API](https://github.com/voiceflow-gallagan/vf-spacy-pii-redac) repository for more details.

4. **Generate Authorization Token**:
   You can set your own authorization token or generate a random one using the following command:

   ```bash
   openssl rand -hex 16
   ```


### Running the Server

Start the server using Bun:
  ```bash
   bun start
  ```

The server will run on port **3000** by default.

## API Endpoints

### `/export`

This endpoint allows you to export transcripts with various options.

#### Mandatory Header

- `Authorization`: Must be set to the value of `AUTHORIZATION_TOKEN` from your **.env** file.

#### Mandatory Parameters

If not set in your **.env** file or if you want to override them, you have to pass them in the request:

- `vfApiKey`: Your **Voiceflow API key**.
- `projectID`: The **project ID** of the VF agent you want to export transcripts from.

#### Optional Parameters

- `tag`: Filter transcripts by a specific tag.
- `range`: Specify a range for the transcripts (**Today**, **Yesterday**, **Last 7 days**, **Last 30 days**, **All time**).
- `startDate`: Filter transcripts starting from this date (ISO 8601 format **YYYY-MM-DD**).
- `endDate`: Filter transcripts up to this date (ISO 8601 format **YYYY-MM-DD**).
- `singleFile`: Set to **true** to export a single file.

### Example Request

```bash
curl -X GET "http://localhost:3000/export?range=Last%207%20Days" \
-H "Authorization: your_authorization_token"
```

```bash
curl -X GET "http://localhost:3000/export?vfApiKey=your_voiceflow_api_key&projectId=your_project_id&tag=exampleTag&startDate=2023-01-01&endDate=2023-01-31" \
-H "Authorization: your_authorization_token"
```

## Docker Setup

This project can be run using Docker and Docker Compose, which simplifies the setup process and ensures a consistent environment.

### Prerequisites

- **Docker**: Ensure you have Docker installed on your machine. You can download it from [Docker's official website](https://www.docker.com/products/docker-desktop).
- **Docker Compose**: Docker Desktop includes Docker Compose, but you can also install it separately if needed.

### Building and Running the Application

1. **Build the Docker Image**:
   Navigate to the root directory of the project and run the following command to build the Docker image:

   ```bash
   docker compose build
   ```

2. **Run the Application**:
   After building the image, you can start the application using:

   ```bash
   docker compose up
   ```

   This command will start the server, and it will be accessible on the port specified in your `.env` file (default is 3000).

3. **Stopping the Application**:
   To stop the application, you can use:

   ```bash
   docker compose down
   ```

### Environment Variables

Ensure you have a `.env` file in the root directory with the necessary environment variables. Refer to the [Installation](#installation) section for the required variables.

### Accessing the Application

Once the application is running, you can access it at `http://localhost:3000` (or the port specified in your `.env` file).

### Troubleshooting

- **Permission Issues**: If you encounter permission issues, ensure that the directories used by the application have the correct permissions.
- **Logs**: Check the logs for any errors or messages that can help diagnose issues. You can view logs using:

  ```bash
  docker compose logs
  ```



  [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_vf-transcripts-csv-export&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_vf-transcripts-csv-export)

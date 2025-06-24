# Sitemap KB Auto Updater

This project is a sitemap processor that updates a knowledge base using the Voiceflow API. It provides both API endpoints and a scheduled cron job for processing sitemaps. When available, it will use last update info from the sitemaps to check if the doc need to be updated and if there are new documents to add to the knowledge base.

## Quick Setup

1. Clone the repository:
   ```
   git clone https://github.com/voiceflow-gallagan/sitemap-kb-auto-updater.git
   cd sitemap-kb-auto-updater
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up your environment variables (see Configuration section).

4. Start the server:
   ```
   bun run start
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
VOICEFLOW_API_KEY=your_voiceflow_api_key
USE_CRON=true_or_false
PORT=3000
```

- `VOICEFLOW_API_KEY`: Your Voiceflow API key
- `USE_CRON`: Set to 'true' to enable the weekly cron job, 'false' to disable
- `PORT`: The port on which the server will run (default: 3000)

## API Endpoints

### 1. Get Queue Status

- **URL**: `/status`
- **Method**: `GET`
- **Response Example**:
  ```json
  {
    "isProcessing": false,
    "remaining": 0,
    "processed": 42
  }
  ```

### 2. Process Sitemaps

- **URL**: `/process-sitemaps`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "sitemaps": ["https://example.com/sitemap1.xml", "https://example.com/sitemap2.xml"],
    "apikey": "optional_api_key_to_override_env_variable"
  }
  ```
- **Response**:
  - Success: Status 202 with message "Processing sitemaps"
  - Error: Status 400 with message "Invalid request body"

Note: If `apikey` is provided in the request body, it will be used instead of the one in the `.env` file.

## Cron Job

If `USE_CRON` is set to 'true' in the `.env` file, a weekly cron job will run every Sunday at midnight to process sitemaps listed in the `sitemaps.txt` file.

### sitemaps.txt Format

Create a `sitemaps.txt` file in the root directory. Each line should contain a single sitemap URL:
```
https://example.com/sitemap1.xml
https://example.com/sitemap2.xml
https://another-site.com/sitemap.xml
```

## Install on Linux

The install script will install the dependencies, docker compose and start the service.
Tested on AWS Lightsail (Ubuntu 22.04).

```
VF_API_KEY=your_api_key PORT=3000 USE_CRON=true bash -c "$(curl -fsSL https://raw.githubusercontent.com/voiceflow-gallagan/vf-sitemap-kb-auto-updater/main/install.sh)"
```

Always review scripts before running them, especially when downloading and executing in one command.
Make sure you trust the source of the script.
If you want to review the script before running it, you can download it first and then execute it:

```
curl -sSLO https://raw.githubusercontent.com/voiceflow-gallagan/vf-sitemap-kb-auto-updater/main/install.sh -o install.sh
chmod +x install.sh
VF_API_KEY=your_vf_api_key PORT=3000 USE_CRON=true ./install.sh
```


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_vf-sitemap-kb-auto-updater&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_vf-sitemap-kb-auto-updater)

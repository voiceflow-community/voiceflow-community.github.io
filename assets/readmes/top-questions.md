# Top Questions Analyzer

A tool to analyze and cluster the most frequently asked questions from your Voiceflow assistant's transcripts. It uses Natural to extract questions and GPT-4o to intelligently group similar questions and provide a top questions report.

## Features

- Analyze questions from different time ranges (today, yesterday, last 7 days, last 30 days, all time)
- Extract questions from transcripts using Natural
- Smart question clustering using GPT-4o
- Detailed token usage and cost tracking
- Two operation modes:
  - CLI mode for direct analysis
  - Server mode for API access

## Quickstart

1. Clone the repository:
```bash
git clone https://github.com/yourusername/top-10-questions.git
cd top-10-questions
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment template and fill in your credentials:
```bash
cp .env.template .env
```

4. Run in CLI mode:
```bash
# Analyze last 7 days, top 10 questions
npm start

# Analyze today's questions, top 5 questions
npm start -- -r today -t 5

# See all options
npm start -- --help
```

5. Run in server mode:
```bash
npm run server
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Required
VF_API_KEY=your_voiceflow_api_key
PROJECT_ID=your_project_id
OPENAI_API_KEY=your_openai_api_key

# Optional
# Number of top questions to return (Defaults to 10)
TOP_QUESTIONS=10

# Time range to analyze (today|yesterday|last7|last30|all) (Defaults to last7)
TIME_RANGE=last7

# Optional: Voiceflow cloud environment (Defaults to production)
VF_CLOUD=general|development|staging
```

## CLI Mode

The CLI mode provides direct analysis of questions with various options:

```bash
Options:
  -r, --range <range>  Time range to analyze (today|yesterday|last7|last30|alltime) (default: "last7")
  -t, --top <number>   Number of top questions to show (default: "10")
  -h, --help           Display help
```

Example output:
```
📊 Top Questions:

1. "How can I create a new assistant?"
   Asked 5 times

2. "How do I change my account email?"
   Asked 4 times

...

📈 Token Usage:
   Prompt tokens: 2,066
   Completion tokens: 285
   Total tokens: 2,351

💰 Cost:
   Estimated cost: $0.0633
```

## Server Mode

The server mode provides an HTTP API for analyzing questions. Available endpoints:

### POST /api/analyze
Start a new analysis.

Request (optional, defaults to .env values):
```json
{
  "VF_API_KEY": "optional_override_api_key",
  "PROJECT_ID": "optional_override_project_id"
}
```

Query parameters:
- `range`: Time range to analyze (today|yesterday|last7|last30|alltime)
- `top`: Number of top questions to show

Response:
```json
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "status": "pending",
    "message": "Analysis started. Use the reportId to check status and get results."
  }
}
```

### GET /api/reports/:reportId
Get analysis results.

Response:
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "timeRange": "last7",
    "createdAt": "2024-03-20T10:00:00Z",
    "updatedAt": "2024-03-20T10:01:00Z",
    "result": {
      "questions": [
        {
          "question": "How can I create a new assistant?",
          "count": 5
        },
        // ...more questions
      ],
      "usage": {
        "prompt_tokens": 2066,
        "completion_tokens": 285,
        "total_tokens": 2351,
        "estimated_cost_usd": 0.0633
      }
    }
  }
}
```

### GET /health
Health check endpoint.

Response:
```json
{
  "status": "ok"
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- 401: Invalid Voiceflow API key
- 404: Invalid project ID or report not found
- 500: Internal server error


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_top-questions&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_top-questions)

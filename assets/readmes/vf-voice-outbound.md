# Voiceflow Voice Outbound Demo

This service enables outbound voice calls using Twilio and Voiceflow Voice feature, with advanced call handling features including answering machine detection, call status tracking, and seamless integration with Voiceflow's conversational AI.

## Features

- Initiate outbound voice calls via a simple API endpoint
- Automatic answering machine detection
- Real-time call status tracking
- Integration with Voiceflow for conversational AI
- Detailed call status reporting and event logging

## Prerequisites

- Node.js
- Twilio account with Account SID and Auth Token
- Voiceflow account with API key and webhook ID
- Environment variables properly configured

## Environment Variables

Create a `.env` file with the following variables:

```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
VOICEFLOW_API_KEY=your_voiceflow_api_key
VOICEFLOW_WEBHOOK_ID=your_voiceflow_webhook_id
SERVER_URL=your_server_url
PORT=4242  # Optional, defaults to 4242
```

> **Note:** The Voiceflow API key and webhook ID can be found in your Twilio Phone Numbers section.
> Select your phone number and look for the webhook URL:
> ```
> https://runtime-api.voiceflow.com/v1/twilio/webhooks/{VOICEFLOW_WEBHOOK_ID}/answer?authorization={VOICEFLOW_API_KEY}
> ```


## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

## Local Testing with ngrok

To allow Twilio to reach your local service, you'll need to expose it using a secure tunnel. [ngrok](https://ngrok.com/) is recommended for this purpose.

1. Install ngrok from https://ngrok.com/download

2. Start ngrok tunnel to your local server:

```bash
ngrok http ${PORT:-4242}
```

3. Copy the HTTPS URL provided by ngrok (e.g., `https://your-tunnel.ngrok-free.app`)

4. Update your `.env` file with the ngrok URL:

```env
SERVER_URL=https://your-tunnel.ngrok-free.app
```

> **Note:** The ngrok URL changes each time you restart ngrok unless you have a paid account. Make sure to update your `SERVER_URL` environment variable whenever the URL changes.

## Docker Support

You can also run this service using Docker. Make sure you have Docker and Docker Compose installed on your system.

### Using Docker Compose (Recommended)

1. Make sure your `.env` file is properly configured
2. Build and start the container:

```bash
docker-compose up -d
```

To stop the service:

```bash
docker-compose down
```

### Using Docker Directly

1. Build the Docker image:

```bash
docker build -t voiceflow-outbound .
```

2. Run the container:

```bash
docker run -d \
  --env-file .env \
  -p ${PORT:-4242}:${PORT:-4242} \
  --name voiceflow-outbound \
  voiceflow-outbound
```

To stop the container:

```bash
docker stop voiceflow-outbound
docker rm voiceflow-outbound
```

## API Endpoints

### 1. Initiate a Call
```bash
GET /call?to={phoneNumber}&from={twilioNumber}
```

**Parameters:**
- `to`: Destination phone number (E.164 format)
- `from`: Your Twilio phone number (E.164 format)

**Example:**
```bash
curl "http://localhost:4242/call?to=14155551234&from=14155557890"
```

**Response:**
```json
{
  "message": "Call initiated successfully",
  "callSid": "CA123...",
  "to": "+14155551234",
  "from": "+14155557890",
  "status": "queued",
  "statusUrl": "http://localhost:4242/status/CA123..."
}
```

### 2. Check Call Status
```bash
GET /status/{callId}
```

**Example:**
```bash
curl "http://localhost:4242/status/CA123..."
```

**Response:**
```json
{
  "callSid": "CA123...",
  "status": "completed",
  "lastUpdated": "2024-01-20T12:00:00.000Z",
  "events": [
    {
      "status": "initiated",
      "timestamp": "2024-01-20T11:59:30.000Z"
    },
    {
      "status": "completed",
      "timestamp": "2024-01-20T12:00:00.000Z",
      "duration": "30",
      "answeredBy": "human"
    }
  ]
}
```

## Call Status Flow

The service tracks various call statuses:
- `initiated`: Call has been initiated
- `ringing`: Phone is ringing
- `in-progress`: Call is connected
- `completed`: Call completed successfully
- `declined`: Call was declined or not answered
- `machine`: Call was answered by voicemail
- `error`: An error occurred during the call

## Error Handling

The service includes comprehensive error handling for various scenarios:
- Invalid phone numbers
- Network issues
- Twilio API errors
- Voiceflow integration issues

## Security Considerations

- All sensitive credentials should be stored in environment variables
- The service validates phone numbers before making calls
- Call status information is temporarily stored and automatically cleaned up

## License

MIT

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_vf-voice-outbound&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_vf-voice-outbound)

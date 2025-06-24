# Voiceflow Call Recorder and Audio PII Redaction

A real-time call recording and transcription system built with Voiceflow Twilio voice integration, Next.js, and Bun. This application automatically records incoming calls, transcribes them, and provides a dashboard to manage and review call recordings and transcripts.

## Features

- 🎥 Automatic call recording for incoming calls
- 🔊 Dual-channel recording support
- 📝 Real-time transcription with PII redaction (Twilio Voice Intelligence)
- 💻 Web-based dashboard for call management
- 🔄 Real-time updates via WebSocket

## Prerequisites

- [Bun](https://bun.sh/) runtime installed
- [Node.js](https://nodejs.org/) (v18 or higher)
- A Twilio account with:
  - Account SID
  - Auth Token
  - Voice Intelligence Service SID

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd poc-twilio-call-recorder
```

2. Install dependencies:
```bash
cd dashboard
bun install
```

3. Configure environment variables:
   - Copy the template file:
   ```bash
   cp .env.local.template .env.local
   ```
   - Update `.env.local` with your credentials:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_SERVICE_SID=your_voice_intelligence_service_sid
   PUBLIC_URL=your_public_url
   BUN_SERVER=http://localhost:3902
   NEXT_PUBLIC_BUN_SERVER=http://localhost:3902
   DASHBOARD_PORT=3901
   BUN_PORT=3902
   ```

## Running the Application

1. Start the Bun server:
```bash
cd dashboard
bun run server/index.ts
```

2. In a new terminal, start the Next.js dashboard:
```bash
cd dashboard
bun run dev
```

The application will be available at:
- Dashboard: http://localhost:3901
- Bun Server: http://localhost:3902

## Running with Docker Compose

As an alternative to running the services directly, you can use Docker Compose:

1. Make sure you have Docker and Docker Compose installed on your system

2. Configure environment variables as described in the Setup section

3. Start the services:
```bash
docker compose up -d
```

4. View logs (optional):
```bash
docker compose logs -f
```

5. Stop the services:
```bash
docker compose down
```

The application will be available at the same ports:
- Dashboard: http://localhost:3901
- Bun Server: http://localhost:3902

Note: The Docker setup includes a persistent volume for the database data.

## Twilio Configuration

1. Set up your Twilio phone number
2. Configure the webhook URL in your Twilio console:
   - Voice Configuration -> A call comes in
   - Set to: `[YOUR_PUBLIC_URL]/v1/twilio/webhooks/voice`
   - Method: GET

## Architecture

The application consists of two main components:

1. **Bun Server** (Port 3902)
   - Handles Twilio webhooks
   - Manages call recording
   - Processes transcriptions
   - WebSocket server for real-time updates

2. **Next.js Dashboard** (Port 3901)
   - User interface for call management
   - Real-time call updates
   - Search and filtering capabilities
   - Call record deletion

## Development

The project uses:
- Bun as the runtime and package manager
- TypeScript for type safety
- Next.js for the frontend
- WebSocket for real-time communication

## Security Considerations

- Never commit `.env.local` to version control
- Keep your Twilio credentials secure
- Use HTTPS in production
- Implement proper authentication for the dashboard in production

## License

ISC

## Author

Nicolas Arcay Bermejo | Voiceflow

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_poc-twilio-call-recorder&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_poc-twilio-call-recorder)

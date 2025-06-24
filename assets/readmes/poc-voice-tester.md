# Voice Agent Tester

A web application for testing Voiceflow voice agents through automated test scenarios. This application allows you to create test cases with specific personas and goals, then execute them by making outbound calls to your voice agent.

## Features

- Configure Voiceflow test agent settings (API key, number ID, and target phone number)
- Create and manage test scenarios with personas and goals
- Run tests by making outbound calls to your voice agent
- View test results and conversation history in real-time
- Track completed goals and test status

## Prerequisites

- Node.js 18 or later
- Voiceflow account with a voice agent
- Voiceflow test agent API key and number ID
- Phone number to test against

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd voice-agent-tester
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

1. Go to the Settings page
2. Enter your Voiceflow test agent API key
3. Enter your test agent number ID (found in the outbound API example)
4. Enter the target phone number to test against (in E.164 format)
5. Save the settings

## Usage

1. **Create Test Cases**
   - On the dashboard, use the "Create New Test" form
   - Provide a test name, persona description, scenario, and goals
   - Goals should be entered one per line

2. **Run Tests**
   - Click "Run Test" on any test case
   - The application will initiate an outbound call to your target phone number
   - View the conversation and test results in real-time

3. **View Results**
   - Click on any test to view its results
   - See the conversation history between the agent and tester
   - Track completed goals and test status

## Technology Stack

- Next.js 14
- React 18
- Prisma (SQLite database)
- TypeScript
- Tailwind CSS
- Tremor UI Components

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration

### Tests
- `GET /api/tests` - List all tests
- `POST /api/tests` - Create a new test
- `GET /api/tests/[id]` - Get test details
- `PUT /api/tests/[id]` - Update test
- `DELETE /api/tests/[id]` - Delete test
- `GET /api/tests/[id]/results` - Get test results
- `POST /api/tests/[id]/results` - Create new test result

## License

ISC

## Author

Nicolas Arcay Bermejo | Voiceflow

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_poc-voice-tester&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_poc-voice-tester)

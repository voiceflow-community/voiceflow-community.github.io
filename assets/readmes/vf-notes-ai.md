# Notes AI - Intelligent Note Taking System

A comprehensive AI-powered note-taking application with voice input, thermal printing capabilities, and intelligent agent assistance through Voiceflow integration.

## Features

- **Voice Input**: Record audio and automatically transcribe using OpenAI Whisper API
- **AI Grammar Correction**: Automatically correct spelling and grammar using GPT
- **Thermal Printing**: Print notes on thermal receipt printers over network
- **Intelligent Search**: Full-text search with SQLite FTS5
- **AI Assistant**: Chat with Voiceflow-powered AI agent for note management
- **Modern UI**: Built with Next.js 14, shadcn/ui, and Tailwind CSS
- **Real-time Updates**: Live note editing and management
- **User-Scoped Notes**: Each user's notes are linked to their email address. All note operations (create, fetch, search, update) require a user_email to ensure notes are private to each user.

## Architecture

- **Frontend**: Next.js 14 with App Router, TypeScript, shadcn/ui
- **Backend**: Node.js with Express.js
- **Database**: SQLite with full-text search (FTS5)
- **AI Services**: OpenAI Whisper API, GPT for grammar correction
- **Agent**: Voiceflow Dialog API integration
- **Printer**: node-thermal-printer for ESC/POS compatible printers

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Thermal printer (EPSON/STAR ESC/POS compatible) - optional
- OpenAI API key
- Voiceflow account and API credentials

### 1. Install Dependencies

```bash
# Install root dependencies
npm run install:all

# Or install individually
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Backend Configuration

Copy the environment template and configure:

```bash
cd backend
cp env.template .env
```

Edit `backend/.env` with your configuration. See the template file for all available options and documentation.

**Note:** All note-related API calls require a `user_email` (as a query parameter for GET/search, or in the body for POST) to link notes to the logged-in user.

### 3. Frontend Configuration

```bash
cd frontend
cp env.template .env.local
```

Edit `frontend/.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Printer Setup (Optional)

For thermal printing functionality:

1. **Network Printer**: Configure your thermal printer on the network
2. **Find IP Address**: Use your printer's menu or network tools
3. **Test Connection**: Ensure the printer is accessible via TCP
4. **Update Configuration**: Set `PRINTER_INTERFACE` in backend `.env`

#### Supported Printer Types:
- EPSON ESC/POS compatible printers
- STAR printers
- Any ESC/POS compatible thermal printer

### 5. API Keys Setup

#### OpenAI API Key:
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `OPENAI_API_KEY` in backend `.env`

#### Voiceflow Setup:
1. Create account at [Voiceflow](https://voiceflow.com)
2. Create a new assistant project
3. Get your API key from project settings
4. Configure the backend API endpoints in Voiceflow:
   - Search notes: `http://localhost:5000/api/voiceflow/action`
   - Create note: `http://localhost:5000/api/voiceflow/action`
   - Update note: `http://localhost:5000/api/voiceflow/action`
   - Delete note: `http://localhost:5000/api/voiceflow/action`
   - Print note: `http://localhost:5000/api/voiceflow/action`
   - Print message: `http://localhost:5000/api/voiceflow/action`

## Running the Application

### Development Mode

Start both backend and frontend in development mode:

```bash
npm run dev
```

Or start individually:

```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run frontend:dev
```

### Production Mode

```bash
# Build frontend
npm run build

# Start production
npm run backend:start
npm run frontend:start
```

## API Endpoints

### Notes API
- `GET /api/notes?user_email=you@email.com` - Get all notes for the user
- `GET /api/notes/search?user_email=you@email.com&q=...` - Search notes for the user
- `GET /api/notes/:id` - Get specific note (should belong to user)
- `POST /api/notes` - Create new note (include user_email in body)
- `PUT /api/notes/:id` - Update note (user_email association enforced)
- `DELETE /api/notes/:id` - Delete note

### Voice API
- `POST /api/voice/transcribe` - Transcribe audio file
- `POST /api/voice/correct` - Correct text grammar
- `POST /api/voice/transcribe-and-correct` - Combined transcribe and correct

### Printer API
- `GET /api/printer/status` - Check printer status
- `POST /api/printer/test` - Print test page
- `POST /api/printer/print/:id` - Print specific note
- `POST /api/printer/print-multiple` - Print multiple notes
- `POST /api/printer/print-message` - Print custom message/text

### Voiceflow API
- `POST /api/voiceflow/chat` - Chat with AI assistant
- `POST /api/voiceflow/action` - Execute AI actions
- `GET /api/voiceflow/config` - Get configuration status

## Usage Guide

### Creating Notes

1. **Text Input**: Use the editor tab to write notes manually
2. **Voice Input**: Record or upload audio for automatic transcription
3. **AI Chat**: Ask the AI assistant to create notes for you

**Note:** All notes are linked to your email address. You will only see your own notes when logged in.

### Voice Features

1. **Recording**: Click "Record" and speak clearly
2. **File Upload**: Upload existing audio files
3. **Transcription**: Automatic speech-to-text conversion
4. **Grammar Correction**: AI-powered text improvement

### Printing

1. **Single Note**: Click printer icon next to any note
2. **Batch Printing**: Select multiple notes for batch printing
3. **Test Print**: Use printer status page to test connection

### AI Assistant

The Voiceflow-powered AI can help with:
- Creating new notes from descriptions
- Searching existing notes
- Updating note content
- Printing notes
- Printing custom messages and AI responses
- Managing note organization

Example commands:
- "Create a note about today's meeting with John"
- "Search for notes about project planning"
- "Print the note about quarterly goals"
- "Print a summary of our conversation"
- "Print today's task list for me"
- "Update my shopping list note"

## Database Schema

### Notes Table
```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  tags TEXT,
  is_printed BOOLEAN DEFAULT 0,
  print_count INTEGER DEFAULT 0,
  last_printed_at DATETIME
);
```

### Full-Text Search
```sql
CREATE VIRTUAL TABLE notes_fts USING fts5(
  title, content, tags, content=notes, content_rowid=id
);
```

## Troubleshooting

### Printer Issues
- Verify network connectivity to printer
- Check printer IP address and port
- Ensure printer supports ESC/POS commands
- Test with manufacturer's software first

### Voice Recognition Issues
- Check microphone permissions
- Use clear audio without background noise
- Ensure stable internet connection for API calls
- Verify OpenAI API key and credits

### API Issues
- Check backend server is running
- Verify environment variables are set
- Check API key validity and quota
- Review server logs for detailed errors

### Voiceflow Integration
- Verify API credentials are correct
- Check project ID and version ID
- Ensure webhook endpoints are accessible
- Test Voiceflow project independently

## Development

### Project Structure
```
notes-ai/
├── backend/                 # Express.js backend
│   ├── routes/             # API routes
│   ├── database/           # Database configuration
│   ├── uploads/            # File uploads directory
│   └── server.js           # Main server file
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utility functions
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
└── README.md              # This file
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, SQLite, Multer
- **AI/ML**: OpenAI Whisper, GPT-3.5 Turbo
- **Printing**: node-thermal-printer
- **Agent**: Voiceflow Dialog API
- **Other**: Axios, date-fns, lucide-react

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check GitHub issues
4. Create a new issue with detailed information

---

**Notes AI** - Making note-taking intelligent and accessible

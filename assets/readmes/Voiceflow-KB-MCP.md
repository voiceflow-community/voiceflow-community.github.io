# Voiceflow Knowledge Base MCP Server

A Node.js server that provides access to the Voiceflow Knowledge Base Query API using the Model Context Protocol (MCP) for seamless AI assistant integration.

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example` template:
   ```
   cp .env.example .env
   ```
4. Add your Voiceflow API key and customize settings in the `.env` file

The server will communicate using the Model Context Protocol over stdio.

## MCP Integration

This server exposes the following MCP tool:

### query_knowledge_base

Query the Voiceflow Knowledge Base using the MCP protocol.

**Input Schema:**
```json
{
  "question": "What products do you sell?",
  "chunkLimit": 3,
  "synthesis": true,
  "settings": {
    "model": "claude-3-sonnet",
    "temperature": 0.1,
    "system": "You are an AI assistant..."
  }
}
```

**Example requests:**

Basic query with default settings:
```json
{
  "question": "What is Voiceflow?"
}
```

Query with synthesis disabled (returns only knowledge chunks without AI processing):
```json
{
  "question": "How do I create a dialog in Voiceflow?",
  "synthesis": false,
  "chunkLimit": 5
}
```

Query with custom model settings:
```json
{
  "question": "How do I integrate with Discord?",
  "settings": {
    "model": "gpt-4o",
    "temperature": 0.3,
    "system": "You are a technical support expert. Provide step-by-step instructions."
  }
}
```

Note: The `settings` object is only used when `synthesis` is `true`. If `synthesis` is `false`, the settings are ignored, and only the relevant chunks are returned without a synthesized answer.

## MCP Configuration

To use this server with an MCP-compatible system, configure it as follows:

```json
"vf-kb-server": {
  "command": "node",
  "args": ["index.js"],
  "env": {
    "VOICEFLOW_API_KEY": "${VOICEFLOW_API_KEY}",
    "DEFAULT_SYNTHESIS": "${DEFAULT_SYNTHESIS}",
    "DEFAULT_CHUNK_LIMIT": "${DEFAULT_CHUNK_LIMIT}",
    "DEFAULT_MODEL": "${DEFAULT_MODEL}",
    "DEFAULT_TEMPERATURE": "${DEFAULT_TEMPERATURE}",
    "DEFAULT_SYSTEM_PROMPT": "${DEFAULT_SYSTEM_PROMPT}"
  },
  "disabled": false,
  "autoApprove": []
}
```

You can omit any of the optional environment variables to use the server's default values.

## Environment Variables

### Required
- `VOICEFLOW_API_KEY`: Your Voiceflow Knowledge Base API key

### Default Query Settings (Optional)
- `DEFAULT_SYNTHESIS`: Whether to synthesize responses by default (`true` or `false`, default: `false`)
- `DEFAULT_CHUNK_LIMIT`: Default number of chunks to use for response (default: `3`)

### Model Settings (Only used when synthesis is enabled)
- `DEFAULT_MODEL`: Default model to use (default: `gpt-4`)
- `DEFAULT_TEMPERATURE`: Default temperature setting (default: `0.1`)
- `DEFAULT_SYSTEM_PROMPT`: Default system prompt for the AI assistant

## Troubleshooting

- **Missing API Key**: If you get an error about VOICEFLOW_API_KEY not being configured, make sure your .env file contains a valid API key.
- **Query Failures**: Check your API key permissions and ensure it has access to the Knowledge Base you're trying to query.
- **Empty Results**: If your queries return no chunks, try increasing the chunk limit or refining your question to be more specific.

## About Voiceflow Knowledge Base API

The Voiceflow Knowledge Base API allows you to query documents stored in a Voiceflow Knowledge Base. It can return both raw document chunks and AI-synthesized answers based on the retrieved information. For more details, see the [Voiceflow Developer Documentation](https://docs.voiceflow.com/reference/post_knowledge-base-query-1).


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_Voiceflow-KB-MCP&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_Voiceflow-KB-MCP)

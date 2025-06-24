# Voiceflow Perplexity Reasoning Extension

Integrate Perplexity AI's reasoning capabilities into your Voiceflow widget for step-by-step reasoning and professional responses.

## Features

- Step-by-step reasoning visualization
- Professional and succinct responses
- Support for Perplexity's Sonar reasoning models
- Real-time streaming of reasoning and answers

## Setup

1. Get a Perplexity API key from [Perplexity API](https://docs.perplexity.ai/)
2. Import the example agent file: `Perplexity_Reasoning_(Extension)-2025-02-19_13-57.vf`
3. Set your API key in the project {ppxApiKey} variable

## Usage

You can use this payload in your custom action, fell free to modify the system prompt:

```json
{
  "apiKey": "{ppxApiKey}",
  "model": "{model}",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert. Keep your reasoning succinct and spoken professionally"
    },
    {
      "role": "user",
      "content": "{last_utterance}"
    }
  ]
}
```

### Available Models

- `sonar-reasoning`: Standard reasoning model
- `sonar-reasoning-pro`: Enhanced reasoning capabilities
- `sonar-pro`: Pro model without reasoning capabilities
- `sonar`: Standard model without reasoning capabilities

## Resources

- [Perplexity API Documentation](https://docs.perplexity.ai/)
- [Voiceflow Documentation](https://www.voiceflow.com/docs)

## Notes

Keep in mind that this example send your Perplexity API key to the chat widget,
on production you want to use a proxy to make the request to the Perplexity API and
use a solution like the one we are using in our [domain checker](https://github.com/voiceflow-gallagan/vf-chat-domain-checker) example.


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_voiceflow-perplexity-reasoning-extension&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_voiceflow-perplexity-reasoning-extension)

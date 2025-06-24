# PII Anonymization API

This repository contains a service that exposes an endpoint for anonymizing Personally Identifiable Information (PII). It uses the [Microsoft Presidio](https://github.com/microsoft/presidio/tree/main) project for the anonymization process. The application is built on [Bun](https://bun.sh), a JavaScript runtime that helps to create performant applications.

## API Endpoint

The application exposes the `/anonymize` endpoint which accepts a POST request. This endpoint simplify the process by doing the analyze and the anonimize process at once.
The request body should contain a text to be anonymized, a language shortcode, and optionally, a configuration for the anonymizers.

While this sample demo use English only, Presidio can be used to detect PII entities in multiple languages.
Refer to the [multi-language support](languages.md) for more information.

### Request
The request body should contain a text to be anonymized, and optionally, a score, an exlude array (words in that array will not be ananymized) and a configuration for the anonymizers.
You can find more info regarding the available operators in Presidio documentation here: https://microsoft.github.io/presidio/anonymizer/#built-in-operators
And a list of the supported entities is available here: https://microsoft.github.io/presidio/supported_entities/

Here is an example of a simple request:
`POST: http://127.0.0.1:3006/anonymize`
```json
{
	"text":"John Smith phone number is +33123456789"
}
```

The response will contain the anonymized text:

```json
  {
	"text": "<PERSON> phone number is <PHONE_NUMBER>",
	"items": [
		{
			"start": 25,
			"end": 39,
			"entity_type": "PHONE_NUMBER",
			"text": "<PHONE_NUMBER>",
			"operator": "replace"
		},
		{
			"start": 0,
			"end": 8,
			"entity_type": "PERSON",
			"text": "<PERSON>",
			"operator": "replace"
		}
	]
}
```

And a more complex one with anonymizers configuration:

```json
{
	"text":"John Smith phone number is +33123456789",
	"language":"en",
	"score":0.75,
	"exclude":["min", "hi", "earth", "max", "Voiceflow"],
	"anonymizers": {
		"PHONE_NUMBER": {
			"type": "mask",
			"masking_char": "*",
			"chars_to_mask": 8,
			"from_end": false
		},
		"EMAIL_ADDRESS": {
			"type": "mask",
			"masking_char": "*",
			"chars_to_mask": 8,
			"from_end": false
		},
		"IP_ADDRESS": {
			"type": "mask",
			"masking_char": "*"
		},
		"DATE_TIME": {
			"type": "keep"
		},
		"URL": {
			"type": "keep"
		},
		"LOCATION": {
			"type": "replace",
			"new_value": "LOCATION"
		},
		"DEFAULT": {
			"type": "replace",
			"new_value": "ANONYMIZED"
		}
	}
}
```

The response:

```json
  {
	"text": "ANONYMIZED phone number is ******456789",
	"items": [
		{
			"start": 27,
			"end": 39,
			"entity_type": "PHONE_NUMBER",
			"text": "******456789",
			"operator": "mask"
		},
		{
			"start": 0,
			"end": 10,
			"entity_type": "PERSON",
			"text": "ANONYMIZED",
			"operator": "replace"
		}
	]
}
```

## Setup

### Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: The environment in which the application is running (default  to "production").
- `PORT`: The port on which the application will listen.
- `ANALYZE_ENDPOINT`: The endpoint of the Presidio Analyzer service (default to `http://presidio-analyzer:3000/analyze`).
- `ANONYMIZE_ENDPOINT`: The endpoint of the Presidio Anonymizer service (default to `http://presidio-anonymizer:3000/anonymize`).
- `SCORE`: The score threshold for the Presidio Anonymizer service (default to `0.75`).

These variables should be set in a `.env` file in the root directory of the project.
You can use the **.env.template** as an example:

```env
NODE_ENV = production
PORT = 3006
ANALYZE_ENDPOINT = http://presidio-analyzer:3000/analyze
ANONYMIZE_ENDPOINT = http://presidio-anonymizer:3000/anonymize
SCORE = 0.75
```

### Docker

The application use Docker Compose to manage the presidio services, the app and its dependencies. The `docker-compose.yml` file in the root directory of the project defines the services needed to run the application.

### Scripts

The `package.json` file defines several scripts for running the application and managing Docker containers:

- `dev`: Runs only the application and in development mode, with file watching enabled.
- `app`: Runs only the application
- `start`: Starts all the containers and the application.
- `stop`: Stops all the containers and the application.

So to run everything, use:
`npm start`

## Video
https://youtu.be/CKIoCGraulM

## Demo project
You can import the demo project on your Voiceflow dashboard using this link:
https://creator.voiceflow.com/dashboard?import=652911763fb9db0007fca037

## Voiceflow Discord

We can talk about this project on Discord
https://discord.gg/9JRv5buT39


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_presidio-api&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_presidio-api)

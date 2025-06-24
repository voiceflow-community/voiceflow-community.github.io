# SpaCy PII Redaction Service

A Flask-based API service that uses SpaCy's Named Entity Recognition (NER) to identify and redact Personally Identifiable Information (PII) from text.

## What is SpaCy PII?

SpaCy is an open-source library for advanced Natural Language Processing in Python. The service uses SpaCy's NER capabilities to identify sensitive information like:

- Names (PERSON)
- Organizations (ORG)
- Locations (GPE, LOC)
- Dates and Times
- Money values
- Phone numbers
- Email addresses
- Credit card numbers
- Social Security Numbers
- IP addresses
- Account/Order numbers
- Websites
- Brand names
- And more...

Learn more about SpaCy NER at [SpaCy's Named Entities Documentation](https://spacy.io/usage/linguistic-features#named-entities)

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Running the Service

1. Clone the repository:
   ```bash
   git clone https://github.com/voiceflow-gallagan/vf-spacy-pii-redac.git
   ```

2. Navigate to the project directory:
   ```bash
   cd vf-spacy-pii-redac
   ```

3. Build and run the Docker container:
   ```bash
   docker-compose up --build
   ```

The service will start on port 5005 by default.

### Configuration

To change the port, rename the `.env.template` file or create a `.env` file in the root directory with the following options:

```
FLASK_PORT=5005
SPACY_MODEL=en_core_web_md
DEFAULT_MATCHERS=EMAIL,PHONE,SSN,CREDIT_CARD,ACCOUNT_NUMBER,IP_ADDRESS
```

### SpaCy Model Configuration

You can configure which SpaCy model to use by setting the `SPACY_MODEL` environment variable in your `.env` file. Available options include:

- `en_core_web_sm`: Small model (~12MB) - Faster but less accurate
- `en_core_web_md`: Medium model (~40MB) - Good balance of speed and accuracy
- `en_core_web_lg`: Large model (~560MB) - More accurate but slower
- `en_core_web_trf`: Transformer model (~440MB) - Most accurate but requires more resources

The service uses the medium model (`en_core_web_md`) by default if no model is specified.

## API Endpoints

## GET /available-matchers

Returns a list of all available matchers and their descriptions.

```bash
curl http://localhost:5005/available-matchers
```

### POST /redact

Redacts PII from the provided text. You can specify which matchers to use.


#### Request Body

```json
{
"text": "John Doe works at Acme Corp in New York. Contact: (555)123-4567 or john.doe@acme.com",
"matchers": ["EMAIL", "PHONE"] // Optional: specify which matchers to use
}
```

#### Response

```json
{
  "redacted_text": "[REDACTED] works at Acme Corp in [REDACTED]. Contact: [REDACTED] or [REDACTED]"
}
```

#### cURL Example

Using all matchers:

```bash
curl -X POST \
http://localhost:5005/redact \
-H 'Content-Type: application/json' \
-d '{"text": "John Doe works at Acme Corp in New York. Contact: (555)123-4567 or john.doe@acme.com"}'
```

Using specific matchers:

```bash
curl -X POST \
http://localhost:5005/redact \
-H 'Content-Type: application/json' \
-d '{
"text": "John Doe works at Acme Corp in New York. Contact: (555)123-4567 or john.doe@acme.com",
"matchers": ["EMAIL", "PHONE"]
}'
```

## Available Matchers

The service includes the following custom matchers:
- `EMAIL`: Email addresses
- `WEBSITE`: Website URLs
- `BRAND`: Brand names
- `PHONE`: Phone numbers in various formats
- `CREDIT_CARD`: Credit card numbers
- `SSN`: Social Security Numbers
- `IP_ADDRESS`: IP addresses
- `ADDRESS`: Street addresses, postal codes, and building numbers
- `ACCOUNT`: Account/Order reference numbers

Additionally, the following NER entities are also available:

- `PERSON`: Names of people (always included)
- `ORG`: Organizations, companies, institutions
- `GPE`: Countries, cities, states (always included)
- `MONEY`: Monetary values
- `LOC`: Non-GPE locations, mountain ranges, water bodies
- `PRODUCT`: Products, objects, vehicles, foods, etc.
- `DATE`: Absolute or relative dates (always included)
- `TIME`: Times smaller than a day (always included)
- `FAC`: Buildings, airports, highways, bridges
- `LAW`: Named documents made into laws
- `EVENT`: Named hurricanes, battles, wars, sports events
- `NORP`: Nationalities, religious or political groups (always included)
- `WORK_OF_ART`: Titles of books, songs, etc.


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_vf-spacy-pii-redac&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_vf-spacy-pii-redac)

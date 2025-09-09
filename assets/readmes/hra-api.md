# Hallucination Risk Assessment API

> **Based on [HallBayes](https://github.com/leochlon/hallbayes)** - Implementation of "Compression Failure in LLMs: Bayesian in Expectation, Not in Realization"

**REST API for post-hoc calibration** of large language models using the Expectation-level Decompression Law (EDFL) framework. This API turns raw prompts into:
1) **bounded hallucination risk** calculations using EDFL methodology, and
2) **decision recommendations** to **ANSWER** or **REFUSE** under target SLA requirements.

The system evaluates prompts by creating "skeleton" versions (with masked entities/evidence) to measure information lift and calculate hallucination risk bounds. All scoring relies **only** on the OpenAI Chat Completions API.

---

## Quick Start

### Installation & Setup

```bash
# Clone repository
git clone https://github.com/voiceflow-community/hra-api.git
cd hra-api

# Create configuration file
cp .env.example .env
# Edit .env and add your OpenAI API key and preferred port

# Run with Docker (recommended)
docker compose up -d
```

### Alternative: Local Python Installation

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the API server (uses port from .env file)
python api/rest_api.py
```

The API will be available at the configured host and port (default: `http://localhost:3169`)

### Test the API

```bash
# Health check (use your configured port)
curl http://localhost:3169/api/health

# Evaluate a prompt
curl -X POST http://localhost:3169/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Who won the 2019 Nobel Prize in Physics?",
    "settings": {
      "model": "gpt-4.1-mini",
      "h_star": 0.05,
      "generate_answer": true
    }
  }'
```

---

## API Endpoints

### POST `/api/evaluate`

Main evaluation endpoint that assesses hallucination risk and makes answer/refuse decisions.

**Request:**
```json
{
  "prompt": "Your question here",
  "api_key": "sk-...",  // Optional if OPENAI_API_KEY is set
  "settings": {
    "model": "gpt-4.1-mini",
    "h_star": 0.05,
    "n_samples": 7,
    "m": 6,
    "skeleton_policy": "closed_book",
    "generate_answer": false,
    "verbosity": "low",
    "reasoning_effort": "minimal"
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "decision": "ANSWER",
    "decision_answer": true,
    "rationale": "High information lift (Δ̄=2.45 nats) vs requirement (B2T=1.76 nats). ISR=1.39 > 1.0...",
    "metrics": {
      "delta_bar": 2.45,
      "b2t": 1.76,
      "isr": 1.39,
      "roh_bound": 0.023,
      "q_conservative": 0.143,
      "q_avg": 0.167
    },
    "answer": "Generated answer if requested and allowed",
    "sla_certificate": {...}
  },
  "settings_used": {...}
}
```

### Additional Endpoints

- `GET /api/health` - Health check
- `GET /api/models` - List supported OpenAI models
- `GET /api/settings/defaults` - Get default evaluation settings

---

## Core Mathematical Framework

### The EDFL Principle

The system uses the Expectation-level Decompression Law (EDFL) to bound hallucination risk:

- **Information budget:** $\bar{\Delta} = \frac{1}{m}\sum_k \mathrm{clip}_+(\log P(y) - \log S_k(y), B)$
- **Prior masses:** $q_k = S_k(\mathcal{A})$ with $\bar{q} = \frac{1}{m}\sum_k q_k$
- **EDFL bound:** $\bar{\Delta} \ge \mathrm{KL}(\mathrm{Ber}(p) \| \mathrm{Ber}(\bar{q})) \Rightarrow p \le p_{\max}(\bar{\Delta},\bar{q})$

### Decision Logic

**Two-gate system:**
1. **Information Sufficiency Ratio:** $\mathrm{ISR} = \bar{\Delta}/\mathrm{B2T} \ge 1.0$
2. **Safety Margin:** $\bar{\Delta} \ge \mathrm{B2T} + \text{margin}$

**ANSWER** if both conditions are met, **REFUSE** otherwise.

---

## Configuration Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `model` | `"gpt-4.1-mini"` | `gpt-4o`, `gpt-4o-mini`, `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`, `gpt-5`, `gpt-5-mini`, `gpt-5-nano` | Model for evaluation |
| `verbosity` | `"low"` | `low`, `medium`, `high` | GPT-5 verbosity level |
| `reasoning_effort` | `"minimal"` | `minimal`, `low`, `medium`, `high` | GPT-5 reasoning effort |
| `h_star` | `0.05` | `0.001-0.5` | Target hallucination rate |
| `n_samples` | `7` | `1-15` | Samples per prompt variant |
| `m` | `6` | `2-12` | Number of skeleton variants |
| `skeleton_policy` | `"closed_book"` | `auto`, `evidence_erase`, `closed_book` | Skeleton generation method |
| `temperature` | `0.3` | `0.0-1.0` | Model temperature |
| `isr_threshold` | `1.0` | `0.1-5.0` | ISR gate threshold |
| `margin_extra_bits` | `0.2` | `0.0-5.0` | Safety margin (nats) |
| `B_clip` | `12.0` | `1.0-50.0` | Information clipping bound |

---

## Skeleton Policies

### Closed-Book Mode (Default)
- Creates skeletons by **semantic masking** of entities, numbers, and quoted spans
- Uses progressive masking strengths (0.25, 0.35, 0.5, 0.65, 0.8, 0.9)
- Best for general knowledge questions without provided evidence

### Evidence-Erase Mode
- Removes evidence/context sections from prompts
- Preserves task structure and question format
- Use when prompts contain explicit evidence fields

### Auto Mode
- Automatically detects evidence fields and uses evidence-erase
- Falls back to closed-book if no evidence detected

---

## Performance Characteristics

### Model Comparison - "Who won the 2019 Nobel Prize in Physics?"

| Model | Decision | Δ̄ (nats) | ISR | B2T | Latency | Status |
|-------|----------|----------|-----|-----|---------|--------|
| **gpt-4o** | ANSWER | 8.067 | 8.242 | 1.847 | ~15s | High confidence |
| **gpt-4o-mini** | ANSWER | 8.0 | 8.173 | 1.848 | ~12s | Strong performance |
| **gpt-4.1** | ANSWER | 8.0 | 8.173 | 1.848 | ~18s | Consistent |
| **gpt-4.1-mini** | ANSWER | 10.0 | 10.217 | 1.894 | ~20s | **Recommended** |
| **gpt-4.1-nano** | ANSWER | 2.0 | 2.043 | 1.894 | ~8s | Fast, lower confidence |
| **gpt-5** | ANSWER | 10.0 | 10.217 | 1.894 | ~45s | High confidence, slow |
| **gpt-5-mini** | TIMEOUT | - | - | - | >60s | Processing issues |
| **gpt-5-nano** | ANSWER | 10.0 | 5.278 | 1.895 | ~57s | Slow but completes |

### General Performance Metrics

| Metric | Typical Value | Notes |
|--------|--------------|-------|
| **Latency** | 8-20 seconds | gpt-4.1-mini recommended for balance |
| **API calls** | ~42 calls | (1 + 6 skeletons) × 7 samples |
| **Cost** | $0.01-0.03 | Using gpt-4.1-mini |
| **Accuracy** | 95% Wilson bound | Empirically validated |

---

## Python Client Example

```python
import requests

def evaluate_prompt(prompt, port=3169, **settings):
    """Evaluate a prompt using the API."""
    response = requests.post(
        f"http://localhost:{port}/api/evaluate",
        json={"prompt": prompt, "settings": settings}
    )
    return response.json()

# Usage
result = evaluate_prompt(
    "Who discovered penicillin?",
    model="gpt-4.1-mini",
    h_star=0.05,
    generate_answer=True
)

if result["success"]:
    decision = result["result"]["decision"]
    risk_bound = result["result"]["metrics"]["roh_bound"]
    print(f"Decision: {decision}, Risk ≤ {risk_bound:.3f}")
else:
    print(f"Error: {result['error']}")
```

---

## Project Structure

```
.
├── api/
│   ├── __init__.py
│   └── rest_api.py              # Main REST API server
├── scripts/
│   ├── __init__.py
│   └── hallucination_toolkit.py # Core EDFL framework
├── requirements.txt              # Dependencies
├── pyproject.toml               # Project configuration
├── API_DOCUMENTATION.md         # Detailed API docs
└── README.md
```

---

## Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t hallucination-risk-api .

# Run with environment variables from .env file
docker run -p 3169:3169 --env-file .env hallucination-risk-api

# Or run with custom environment variables
docker run -p 3169:3169 \
  -e OPENAI_API_KEY=sk-your-key \
  -e API_PORT=8080 \
  -e API_DEBUG=false \
  hallucination-risk-api
```

### Using Docker Compose (Recommended)

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

The Docker setup includes:
- ✅ Multi-stage build for smaller image size
- ✅ Non-root user for security
- ✅ Health checks for monitoring
- ✅ Automatic .env file loading
- ✅ Port configuration from environment

---

## Environment Variables

Configure these in your `.env` file:

- `OPENAI_API_KEY` - **Required** for OpenAI API access
- `API_HOST` - Host to bind to (default: `127.0.0.1`)
- `API_PORT` - Port to bind to (default: `3169`)
- `API_DEBUG` - Enable debug mode (`true`/`false`, default: `false`)

---

## Understanding System Behavior

### When It Answers
- **Named entities**: Strong masking effect creates high information lift (Δ̄)
- **Factual questions**: Clear information differential between full and skeleton prompts
- **Evidence-based queries**: Large lift when evidence is removed

### When It Refuses
- **Arithmetic**: Pattern recognition allows skeleton answers (low Δ̄)
- **Subjective questions**: No clear information advantage
- **Insufficient context**: Bits-to-Trust (B2T) requirement not met

### Tuning for Higher Answer Rates
- Increase `h_star` (0.05 → 0.10) to relax risk tolerance
- Decrease `margin_extra_bits` to reduce safety buffer
- Increase `n_samples` (7 → 10) for more stable priors
- Consider switching to evidence-based mode with context

---

## Framework Reference

Based on "Compression Failure in LLMs: Bayesian in Expectation, Not in Realization" methodology with EDFL/ISR/B2T decision framework.

**License:** MIT License - see LICENSE file for details
**Author:** Hassana Labs (https://hassana.io)

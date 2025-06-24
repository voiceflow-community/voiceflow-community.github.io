# Tico Nano UDP Audio Server

A Node.js server that receives raw PCM audio data over UDP, processes it through Whisper for transcription, send text to Voiceflow Dialog Manager, and returns Voiceflow TTS responses.

## Features

- Receives 16-bit PCM audio data over UDP (port 6980)
- Processes audio with noise gate and gain adjustment
- Transcribes audio using integrated Whisper ASR service
- Generates responses using Voiceflow Dialog Manager
- Returns TTS audio responses to clients

## Requirements

- Node.js v20 or later
- Docker and Docker Compose (for containerized deployment)
- `lame` package for MP3 decoding

## Environment Variables

The project includes a `.env.template` file that you can use as a starting point. Copy it to create your own `.env` file:

```bash
cp .env.template .env
```

Then edit the `.env` file with your specific values:

```env
# Voiceflow API Key
VF_DM_API_KEY=your_voiceflow_api_key
VF_VERSION_ID=development  # Optional, defaults to 'development'. Specifies which version of your Voiceflow project to use.

# Port Configuration
UDP_PORT=6980  # Optional, defaults to 6980
TCP_PORT=12345 # Optional, defaults to 12345

# Groq Cloud Whisper API (Optional)
# Set USE_GROQ to true to use Groq's faster Whisper API instead of the local one.
# Requires a GROQ_API_KEY.
USE_GROQ=false
GROQ_API_KEY=your_groq_api_key
# Optional Groq Settings:
GROQ_API_URL=https://api.groq.com/openai/v1/audio/transcriptions
GROQ_MODEL=whisper-large-v3-turbo # Model ID (see options below)
# GROQ_LANGUAGE=en # Optional: Specify source language (ISO-639-1) for potentially better accuracy. Leave unset for multilingual detection.

# Local Whisper ASR Service Settings (Used if USE_GROQ is false)
WHISPER_SERVER_URL=http://whisper-asr:9000 # Optional, defaults to http://whisper-asr:9000
WHISPER_MODEL=base
WHISPER_ENGINE=openai_whisper
WHISPER_DEVICE=cpu
WHISPER_VAD_FILTER=false
INCLUDE_TEXT_WITH_AUDIO=true # Optional, defaults to false. Set to true to send audio with the preceding text message. (Core2 with screen)
```

### Whisper ASR Configuration Options

#### Available Engines

- `openai_whisper`: The original OpenAI Whisper implementation
- `faster_whisper`: Optimized implementation with improved performance
- `whisperx`: Enhanced version with speaker diarization support

#### Available Models

**Standard Models:**
- `tiny`, `base`, `small`, `medium`
- `large-v1`, `large-v2`, `large-v3` (or `large`)
- `large-v3-turbo` (or `turbo`)

**English-Optimized Models:**
- `tiny.en`, `base.en`, `small.en`, `medium.en`

**Distilled Models:**
- `distil-large-v2`, `distil-medium.en`, `distil-small.en`, `distil-large-v3`
  (Only available for whisperx and faster-whisper engines)

**Model Selection Tips:**
- For English-only applications, the `.en` models tend to perform better, especially for `tiny.en` and `base.en`
- The difference becomes less significant for `small.en` and `medium.en` models
- Distilled models offer improved inference speed while maintaining good accuracy
- For production use, consider using `faster_whisper` with `distil-medium.en` for a good balance of speed and accuracy

#### Device Options

- `cpu`: Run on CPU (default)
- `cuda`: Run on GPU (requires NVIDIA GPU with CUDA support)

#### Voice Activity Detection (VAD)

- `WHISPER_VAD_FILTER=true`: Enable VAD filtering to remove non-speech segments with Faster Whisper engine
- `WHISPER_VAD_FILTER=false`: Disable VAD filtering (default)

VAD filtering helps improve transcription accuracy by removing background noise and silence. It's particularly useful for:
- Reducing false positives in transcription
- Improving processing speed by focusing only on speech segments
- Enhancing the quality of transcriptions in noisy environments

### Groq Cloud Whisper API

If you prefer to use Groq's cloud-based Whisper API (which can be significantly faster, especially without a GPU), you can enable it by setting the following environment variables:

- `USE_GROQ=true`: Enables the Groq API for transcription.
- `GROQ_API_KEY`: Your API key obtained from [console.groq.com](https://console.groq.com/).

When `USE_GROQ` is set to `true`, the following optional variables can also be set:

- `GROQ_API_URL`: The specific Groq API endpoint. Defaults to the transcription endpoint `https://api.groq.com/openai/v1/audio/transcriptions`.
- `GROQ_WHISPER_MODEL`: The Whisper model ID to use. Defaults to `whisper-large-v3-turbo`. Available options:
    - `whisper-large-v3`: Best accuracy, multilingual transcription & translation.
    - `whisper-large-v3-turbo`: Good speed/cost balance, multilingual transcription (no translation).
    - `distil-whisper-large-v3-en`: Fastest, lowest cost, English-only transcription (no translation).
- `GROQ_WHISPER_LANGUAGE`: (Optional) The ISO-639-1 code (e.g., `en`, `fr`, `es`) of the *input* audio language. Specifying this can improve accuracy and latency. If omitted, Groq will auto-detect the language (multilingual).

When `USE_GROQ` is set to `true`, the local Whisper ASR service settings (`WHISPER_SERVER_URL`, `WHISPER_MODEL`, `WHISPER_ENGINE`, `WHISPER_DEVICE`) are ignored for transcription.

### Local Whisper ASR Configuration Options

These options are used when `USE_GROQ` is set to `false` and you are running the local Whisper service using the `local-whisper` profile (`docker compose --profile local-whisper up -d`).

## Installation

1. Clone the repository:
```bash
git clone https://github.com/voiceflow/tico-nano-udp-audio-server.git
cd tico-nano-udp-audio-server
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.template .env
# Edit .env with your specific values
```

## Running

### Docker Deployment (Recommended)

Docker Compose is used to manage the application and its potential dependency on a local Whisper ASR service.

**Option 1: Using Groq API for Transcription (Default / Recommended for Speed)**

Ensure `USE_GROQ=true` and `GROQ_API_KEY=your_key` are set in your `.env` file.

```bash
# This command only starts the main server, relying on Groq.
docker compose up -d
```

**Option 2: Using Local Whisper ASR Service**

Ensure `USE_GROQ=false` is set in your `.env` file and configure the `WHISPER_*` variables as needed.

```bash
# This command starts the main server AND the local whisper-asr service by activating the profile.
docker compose --profile local-whisper up -d
```

To stop the services:

```bash
# Stop services started without the profile
docker compose down

# Stop services started WITH the profile
docker compose --profile local-whisper down
```

### Local Development (Without Docker)

If you want to run the server directly using Node.js (e.g., for debugging) and connect to a *separate* Whisper ASR instance (like the one running in Docker, or another remote one):

1. Ensure your desired Whisper ASR service is running and accessible.
2. Set `USE_GROQ=false` in your `.env` file.
3. Configure `WHISPER_SERVER_URL` in `.env` to point to your running Whisper instance (e.g., `http://localhost:9000` if using the Docker container).
4. Run the server:
   ```bash
   npm install
   node server.js
   ```

## Architecture

- UDP Server (Port 6980): Receives raw PCM audio data
- TCP Server (Port 12345): Handles client connections for responses
- Audio Processing: Noise gate, gain adjustment, and WAV formatting
- Whisper ASR Service: Integrated transcription service
- API Integration: Voiceflow Dialog Manager
- Audio Response: MP3 decoding and PCM streaming

## Whisper ASR Service

The project includes an integrated Whisper ASR service using the [openai-whisper-asr-webservice](https://github.com/ahmetoner/whisper-asr-webservice) Docker image. The service is configured to:

- Use configurable models and engines via environment variables
- Run on CPU or GPU (if available)
- Cache models to improve startup time
- Support multiple output formats (text, JSON, VTT, SRT, TSV)
- Provide word-level timestamps
- Filter out non-speech audio with voice activity detection (VAD)

### Performance Considerations

- For CPU-only environments, use smaller models like `tiny.en` or `base.en`
- For better performance, use the `faster_whisper` engine
- For production use with English content, consider `distil-medium.en` with `faster_whisper`
- For multi-language support, use standard models like `medium` or `large-v3`
- Enable VAD filtering to improve transcription quality and reduce processing time

## M5Stack Device Support

The project includes Arduino sketches for M5Stack devices to enable voice interactions:

### M5Stack Atom Echo
Located in `arduino/atom_echo.ino`, this sketch enables:
- Audio capture using the built-in microphone
- Sending audio data over UDP to the server
- Playing back TTS audio responses through the speaker

### M5Stack Core2
Located in `arduino/core2.ino`, this sketch provides:
- Audio capture using the built-in microphone
- Sending audio data over UDP to the server
- Playing back TTS audio responses through the speaker
- Displaying transcribed text and responses on the built-in screen

### Setup Instructions

1. **Hardware Requirements**
   - M5Stack Atom Echo or M5Stack Core2 device
   - USB Type-C cable for programming
   - Computer with Arduino IDE installed

2. **Software Setup**
   - Install the Arduino IDE (version 1.8.0 or later)
   - Install required libraries through Arduino Library Manager:
     - M5Stack (for Core2) or M5Atom (for Atom Echo)
     - ArduinoJson
     - FastLED
     - AudioTools

3. **Device Configuration**
   - Connect your M5Stack device to your computer via USB
   - Open the appropriate sketch (`atom_echo.ino` or `core2.ino`) in Arduino IDE
   - Select the correct board and port in Arduino IDE:
     - For Atom Echo: Tools → Board → ESP32 Arduino → M5Atom
     - For Core2: Tools → Board → ESP32 Arduino → M5Core2

4. **First-Time Setup**
   - Upload the sketch to your device
   - On first boot, the device will create a WiFi access point named "Tico_Config"
   - Connect to this WiFi network from your computer or phone
   - Open a web browser and navigate to `http://tico-config.local` or the IP address shown on the device
   - In the configuration portal:
     - Select your WiFi network
     - Enter your WiFi password
     - Enter your server address (e.g., `192.168.1.100` or `https://myserver.com:12345`)
   - Click Save and wait for the device to reboot

5. **Using the Device**
   - **Atom Echo**: Press and hold the button to record, release to send
   - **Core2**: Press and hold button A to record, release to send
   - During recording:
     - Red indicator shows recording in progress
     - Blue indicator shows processing
     - Green indicator shows playing response
   - **Core2 Only**: Use buttons B and C to scroll through text responses

6. **Troubleshooting**
   - If the device fails to connect to WiFi, hold the button for 5 seconds during startup to force configuration mode
   - For Atom Echo: The LED will blink red in configuration mode
   - For Core2: The screen will show configuration instructions
   - If audio quality is poor, ensure the device is in a quiet environment and the microphone is unobstructed


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_tico-nano-udp-audio-server&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_tico-nano-udp-audio-server)

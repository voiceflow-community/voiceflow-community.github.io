# Voiceflow Form Extension Demo

This repository demonstrates a custom implementation of the Voiceflow Chat Widget with form-based extensions.
The demo showcases a Renault 5 test drive booking experience.

## Features

- Custom chat widget implementation
- Form-based extensions for handling user interactions
- Waiting and done animations
- Sending data back to the Voiceflow agent for booking functionality

## Prerequisites

- A modern web browser
- A Voiceflow account (for project customization)

## Quick Start

1. Clone this repository:
```bash
git clone https://github.com/voiceflow-gallagan/voiceflow-form-extension-demo.git
cd voiceflow-form-extension-demo
```

2. Import the Renault-2025-01-08_17-28.vf agent to your workspace

3. Update the `index.html` file with your Voiceflow project ID

4. Start a local development server:
```bash
npx serve
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
├── index.html              # Main demo page
├── extensions/
│   └── extensions.js       # Custom Voiceflow extensions
├── images/                 # Image assets
└── styles/
│   └── widget.css         # Custom widget styling
└── Renault-2025-01-08_17-28.vf # Voiceflow agent
```

## Configuration

The chat widget is configured in `index.html` with the following key settings:

- Project ID: Your agent project ID
- Runtime URL: `https://general-runtime.voiceflow.com`
- Version: `development`

## Custom Extensions

The demo includes several custom extensions:
- DisableInputExtension
- WaitingAnimationExtension
- DoneAnimationExtension
- BookingExtension

## Local Development

1. Make sure you have Node.js installed
2. Install `serve` globally (optional):
```bash
npm install -g serve
```

3. Run the local server:
```bash
npx serve
```

4. The site will be available at `http://localhost:3000`


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_voiceflow-form-extension-demo&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_voiceflow-form-extension-demo)

# Voiceflow PDF Text Extraction | Chat Widget Extension

This repository contains a custom Chat widget extension to allow extracting text from PDFs and sending the content back to the Voiceflow agent.

## Getting Started

### Prerequisites

- Bun runtime

### Installing Bun

Bun is a fast all-in-one JavaScript runtime. To install Bun, run the following command:

```
curl -fsSL https://bun.sh/install | bash
```

For more information and alternative installation methods, visit the [official Bun installation guide](https://bun.sh/docs/installation).


### Installation

1. Clone this repository
2. Install dependencies:
   ```
   bun install
   ```
3. Copy the `.env.template` file to `.env` and fill in the required environment variables:
   ```
   cp .env.template .env
   ```

### Running the Server

To start the server, run:

```
bun start
```

The server will start on the port specified in your `.env` file (default is 3002).

### Testing the Chat Widget Locally

Open your browser and go to `http://localhost:3000` (or whatever port you've specified in your `.env` file).

This will serve the `index.html` file and allow you to view and interact with the chat widget in your local environment. The server will handle serving both the HTML file and the necessary script for the extension.

Note: Make sure you've set up your `.env` file correctly, including the `VOICEFLOW_PROJECT_ID`, for the chat widget to function properly.


## PDFExtractExtension

Display a file input to allow the user to upload a PDF file. The content of the PDF file is extracted using [PDF.js](https://github.com/mozilla/pdf.js) and sent back to the agent.


## Using the Extensions with the Chat Widget

To use the extension in your Voiceflow chat widget, include the following snippet code:


```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js"></script>
    <script type="module">
      import { PDFExtractExtension } from 'PATH_TO_EXTENSION/extension.js';
      (function (d, t) {
        var v = d.createElement(t),
          s = d.getElementsByTagName(t)[0];
        v.onload = function () {
          window.voiceflow.chat.load({
            verify: { projectID: 'VOICEFLOW_PROJECT_ID' },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'VOICEFLOW_PROJECT_VERSION',
            user: {
              name: 'Demo User',
            },
            autostart: true,
            allowDangerousHTML: true,
            assistant: {
              extensions: [
                PDFExtractExtension
              ],
            },
          });
        };
        v.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';
        v.type = 'text/javascript';
        s.parentNode.insertBefore(v, s);
      })(document, 'script');
    </script>
```
_**VOICEFLOW_PROJECT_ID**, **VOICEFLOW_PROJECT_VERSION** and **SERVER_URL** are automatically populated with the values from your .env file when you load the index.html file from the server._

To use the chat widget with the extensions on your frontend, you need to:

Replace `VOICEFLOW_PROJECT_ID` with your actual Voiceflow project ID.

Replace `VOICEFLOW_PROJECT_VERSION` with your actual Voiceflow project version.

Replace `PATH_TO_EXTENSION` with your server URL or the path to the extension.js file.



## Environment Variables

Rename `.env.template` to `.env` and fill in the following variables:

- `PORT`: The port number for the server (default: 3208)
- `SERVER_URL`: The URL of your server (default: http://localhost:3000)
- `VOICEFLOW_PROJECT_VERSION`: Your Voiceflow project version
- `VOICEFLOW_PROJECT_ID`: Your Voiceflow project ID
- `VOICEFLOW_GENERAL_RUNTIME_URL`: Your Voiceflow general runtime URL

## Local Server

The local server serves the following files/paths:

`/index.html`: Serves the index.html file
`/scripts/extension.js`: Serves the extension JavaScript file

For more details on the server implementation, refer to the `server.ts` file.


## Voiceflow Agent

You can import the `PDFReaderExtensionDemo.vf` agent from the `agent` folder into your Voiceflow workspace to see how to setup and use the extension.



[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_vf-pdf-content-reader-extension&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_vf-pdf-content-reader-extension)

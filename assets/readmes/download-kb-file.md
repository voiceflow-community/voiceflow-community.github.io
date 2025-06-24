# Voiceflow KB Document Downloader

This Node.js application allows you to download documents from Voiceflow's API by specifying a document ID. It automatically detects the document's file type and saves it with the appropriate extension.

## Prerequisites

- Node.js installed on your machine.
- An API key, project ID, and client key from Voiceflow.

## Setup

1. **Clone the Repository**

   First, clone this repository to your local machine using Git.

   ```
   git clone https://github.com/voiceflow-gallagan/download-kb-file.git
   cd voiceflow-document-downloader
   ```

2. **Install Dependencies**

   Run the following command in the root directory of the project to install the necessary dependencies:

   ```
   npm install
   ```

3. **Configure Environment Variables**

   Copy the `.env.template` file to a new file named `.env`.

   ```
   cp .env.template .env
   ```

   Then, open the `.env` file in your favorite text editor and replace the placeholder values with your actual Voiceflow API key, project ID, and client key.

   ```
   VF_API_KEY=VF.DM.XYZ # YOUR VF API KEY
   VF_PROJECT_ID=65b28XYZ # YOUR VF PROJECT ID
   VF_CLIENT_KEY=POCNIKO # DEFAULT CLIENT KEY
   ```

## Usage

To download a document, run the application with the `--docid` (or `-d`) option followed by the document ID you wish to download.

```
node app.js --docid YOUR_DOCUMENT_ID
```

For example:

```
node app.js --docid 66057447d0cef1bf8ec092b7
```

The application will download the document and save it in the current directory with the correct file extension based on its detected file type.


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_download-kb-file&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_download-kb-file)

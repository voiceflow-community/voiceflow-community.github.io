# WIP | Tico Me

## About
This electron app uses whisper to transcribe audio and uploads the transcript to the Voiceflow Knowledge Base.
This has been tested on MacOs and might need some adjustments to run on other platforms.

## Config
Rename the `config.json.template` to `config.json` and update the values.

If you have access to the **KB Table (JSON) BETA**, set `kbJSON` to `true`
otherwise, set the `voiceflowProjectId` value to your **project's ID** and set `kbJSON` to `false`

## Whisper

For this demo, we are using the following project to run whisper as a webservice:

Github repo: https://github.com/ahmetoner/whisper-asr-webservice

Doc: https://ahmetoner.github.io/whisper-asr-webservice

To run the whisper webservice, pull the docker image and run the container.

```
docker pull onerahmet/openai-whisper-asr-webservice:latest
docker run -d --restart unless-stopped -p 9000:9000 -e ASR_MODEL=base.en
-e ASR_ENGINE=faster_whisper onerahmet/openai-whisper-asr-webservice:latest
```

Set `whisperUrl` in the `config.json` file to the url of the whisper instance.

## Setup

```npm install```

The **node-record-lpcm-16** module requires you to install SoX and it must be available in your **$PATH**.

We've added a **post-install** script to check for **SoX**. If **SoX** is not installed, this script will try to install it for you. If for any reason this script doesn't work, you can try to install **SoX** manually:

For **Mac OS**
`brew install sox`

For most **linux** disto's
`sudo apt-get install sox libsox-fmt-all`

For **Windows**
Working version for Windows is 14.4.1. You can download the binaries or use chocolately to install the package

`choco install sox.portable`

## Run the app

```npm start```

## Build the app (tested on Mac only)
You will have to edit the `package.json` file `build` to set the correct values.

```npm run build```


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_tico-me&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_tico-me)

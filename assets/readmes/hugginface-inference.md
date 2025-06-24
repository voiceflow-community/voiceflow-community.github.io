# Text to Image using Voiceflow API Step and Hugging Face

## Overview

This repository contains a Node.js application with an endpoint `/text2image` leveraging Hugging Face's `textToImage` function of their inference API.

## Tutorial Video

To aid in understanding the application code and constructing a Voiceflow project using it, a detailed Youtube video tutorial is available at [this link](https://youtu.be/Af3v0dt4LQg).

The tutorial provides a walkthrough of the code functionality, as well as a practical guide on integrating it with a Voiceflow project for testing and use.

## How to Use

To use this application, make a POST request to the `/text2image` endpoint with a JSON body consisting of the following parameters:

- `token` (optional): Your Hugging Face `token`.
- `model` (optional): The model used for the text-to-image function. If not provided, it defaults to `'promptero/openjourney-v4'`.
- `prompt`: The text prompt to convert into an image.
- `parameters` (optional): The parameters to customize the model inference.

For example:

```json
{
  "prompt": "YOUR_PROMPT_TEXT"
}
```

```json
{
  "token": "YOUR_HUGGINGFACE_TOKEN",
  "model": "promptero/openjourney-v4",
  "prompt": "YOUR_PROMPT_TEXT",
  "parameters": { "OPTIONAL_PARAMETERS" }
}
```

**Note**: Please ensure to replace `YOUR_HUGGINGFACE_TOKEN`, `YOUR_PROMPT_TEXT`, and optionally provide `parameters` according to your needs.

Return format:

The API returns a JSON object with a `buffer` attribute as an image (Base64 format string).

Failure to provide a prompt will result in an HTTP 400 response with the error message: `"Missing required parameters: prompt"`.

In case the image generation fails, the API will return an HTTP 500 response with an error message.

## Testing the API using ngrok and Voiceflow API Step

This created endpoint can be easily tested and used with Voiceflow, by first exposing your local server to the internet using ngrok, and then calling the resulting URL in Voiceflow's API Step.

To expose your local server using ngrok:

- Download and install ngrok
- Run your server (The port is 3800 in our current application)
- Expose your server to the web using the command `./ngrok http 3800`
- Copy the Forwarding URL from the ngrok command line interface

Now in the Voiceflow API Step, paste the URL copied from ngrok followed by the `/text2image` endpoint, and specify the method as `POST`. In the `Body` section, add the required parameters as mentioned in the "How to Use" section.

## Contribution

You're welcome to contribute to this project. Please fork the repo, make your improvements and then submit a PR.


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_hugginface-inference&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_hugginface-inference)



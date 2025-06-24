# Voiceflow Date Parser API
API to parse human date to ISO 8601 formatted date

This is a Node.js application that convert a date like 'tomorrow at 10:00' to ISO 8601 formatted date.

## Setup

1. Clone this repository:

```bash
git clone https://github.com/voiceflow-gallagan/vf-date-parser.git
cd vf-date-parser
```

2. Copy the `.env.template` file and create a new `.env` file:

```bash
cp .env.template .env
```

3. Edit the `.env` file to reflect the PORT you want to use.

## Environment Variables

The application uses the following environment variables which are stored in a `.env` file:

- `PORT`: The port on which the server will run. Default is 3000.


## Usage

### Run the app locally

1. Install node / npm

2. Install dependencies:

```bash
npm install
```

3. Run the app:

```bash
npm start
```

### Docker container

1. Install Docker / Docker Compose on your machine

2. In the project directory, you can start the container with:

```bash
docker-compose up --build -d
```
or

```bash
npm run docker-start
```

3. To stop the container, you can use:

```bash
docker-compose down
```
or

```bash
npm run docker-stop
```


### API Endpoints

- `GET /health`: Returns the current status of the server.

- `POST /date`: Convert the given date.

  Body payload example:

    ```json
    {
      "date":"next friday at 6pm",
      "tz":1
    }
    ```

  The **date** value can be something like:
  - tomorrow at 10pm
  - next monday
  - in to weeks at 9am

  <br>

  **tz** is the offset for the timezone.
  For example, if you are in France, you should set the tz to 1.

  <br>

  Response example:

    ```json
    {
      "success": true,
      "debug": "next friday at 6pm",
      "error": null,
      "date": "2024-01-26T19:00:00.000Z"
    }
    ```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Voiceflow Discord

We can talk about this project on Discord
https://discord.gg/9JRv5buT39

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_vf-date-parser&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_vf-date-parser)

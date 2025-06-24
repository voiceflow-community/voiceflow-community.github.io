# Zendesk to Voiceflow Knowledge Base Sync

This is a Node.js application that fetches articles from Zendesk using the Zendesk API, cleans them and uploads them to Voiceflow Knowledge Base.

The application uses Express for server setup, 'sitemap-xml-parser' for parsing sitemaps, 'html-to-text' for converting HTML to plain text, Axios for HTTP requests to Voiceflow KB Upload API and 'node-cron' for scheduling tasks.

## Setup

1. Clone this repository:

```bash
git clone https://github.com/your-repo/zendesk-to-voiceflow.git
cd zendesk-to-voiceflow
```

2. Install dependencies:

```bash
npm install
```

3. Copy the `.env.template` file and create a new `.env` file:

```bash
cp .env.template .env
```

4. Edit the `.env` file with your own Zendesk and Voiceflow API keys, as well as any other configurations you want to modify.

## Environment Variables

The application uses the following environment variables which are stored in a `.env` file:

- `PORT`: The port on which the server will run. Default is 3000.
- `DOCS_DIRECTORY`: The directory where the parsed articles will be stored before uploading to Voiceflow KB. Default is 'docs'.
- `KEEP_DOCS`: If set to true, the parsed articles will not be deleted after being uploaded to Voiceflow KB. Default is false.
- `MAX_FAILURES`: The maximum number of failures allowed before the application stops processing the articles. Default is 3.
- `ZENDESK_API_KEY`: Your Zendesk API key. You can get this from your Zendesk account's API settings (see bellow).
- `ZENDESK_SUBDOMAIN`: The subdomain of your Zendesk account.
- `FETCH_METHOD`: Set this to API to use Zendesk API instead of Sitemap.
- `ZENDESK_SITEMAP`: The URL of your Zendesk sitemap. If not provided, the default Zendesk sitemap for your subdomain will be used.
- `SITEMAP_FILTER`: A string that will be used to filter the URLs from the sitemap. Only URLs that contain this string will be processed. Default is '/articles/'.
- `VOICEFLOW_KB_API_KEY`: Your Voiceflow API key. You can get this from your Assistant integrations page on Voiceflow.
- `VOICEFLOW_PROJECT_ID`: Your Voiceflow Project ID. You can get this from your Assistant settings page on Voiceflow.
- `ALWAYS_FORCE`: If set to true, all URLs will be processed without checking the last modification date. Default is false.
- `PREVIOUS_DAYS`: The number of days to check for the last modification date. Default is 7. Ignored is `ALWAYS_FORCE` is set to true.
- `DEBUG`: If set to true, the application will not send anything to your KB. Default is false.

## Getting Zendesk API Key

To obtain your Zendesk API key, follow these steps:

1. Log in to your Zendesk account.
2. Navigate to the Admin panel.
3. In the Admin panel, go to `Apps and Integrations`.
4. Then, navigate to the `APIs` section.
5. In the APIs section, click on `Zendesk API`.
6. In the Zendesk API settings, navigate to the `Tokens` tab.
7. Here, you will see a list of your active API tokens.
8. If you don't have any active tokens or need a new one, click on the `Add API Token` button.
9. Provide a description for your token, leave the `Enabled` checkbox checked, and then click on `Create`.
10. Your new API token will be displayed. Make sure to copy it and store it securely, as you won't be able to see it again.

This token is what you'll use as the `ZENDESK_API_KEY` in your `.env` file.


## Usage

### Interactive Prompt

When the app is not running with PM2, it will start an interactive prompt where you can update the KB or exit the app. If you choose to update the KB, it will ask for your KB API key, project ID, sitemap URL, whether to force the update and the number of previous days to check for last modification date.
Run the application in interactive mode:

```bash
npm start
```

#### Background Mode Launch Using PM2

PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications running forever, reload them without downtime, manage application logging, monitoring, and more.

To setup PM2 and use it for launching the application in background mode, follow these steps:

1. Install PM2 globally:

```bash
npm install pm2 -g
```

2. In the project directory, you can start the application in the background using the `prod` script defined in `package.json`:

```bash
npm run prod
```

This will start the application with PM2 using the settings defined in `ecosystem.config.cjs` and log output to `pm2log`.

The `--exp-backoff-restart-delay=100` option sets the delay between restarts to an exponential backoff, starting from 100ms. If the app crashes, PM2 will wait 100ms before attempting to restart it. If it crashes again, PM2 will wait longer, and so on, to avoid using too many resources when the app is crashing repeatedly.

The `ecosystem.config.cjs` file defines the application settings for PM2. It sets the application name, the entry file of your application, the production environment variables, and disables the watch feature.

3. To stop the application, you can use the `stop` script:

```bash
npm run stop
```

4. To view the status and details of your managed applications, you can use the `pm2 list` and `pm2 show <app-name>` commands.

5. PM2 also creates a system service to ensure that your application is automatically started on boot. You can set this up with the `pm2 startup` command.

For more details, you can check the [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/).

### API Endpoints

- `GET /api/health`: Returns the current status of the server.

- `POST /api/cron`: Triggers the cron update.

  Body payload example:

  ```json
  {
    "expression": "0 0 * * *",
    "run": true,
    "previousDays": 7
  }
  ```
  In the cron expression "0 0 * * *", the first number represents minutes (0-59), the second represents hours (0-23). The asterisks can be replaced with specific values. This expression means the cron job will run every day at midnight.

  For a cron job to run once a week, you could use "0 0 * * 0". This would run the job every Sunday at midnight.

  For more information about cron expressions, visit [Cron Guru](https://crontab.guru/).

- `POST /api/zendesk`: Triggers the update.

  Body payload example:

  ```json
  {
    "apiKey": "VF.DM.XXX",
    "projectID": "XXX",
    "url": "https://learn.voiceflow.com/hc/sitemap.xml",
    "force": true,
    "previousDays": 30
  }
  ```
## Video Tutorial

[![Video Tutorial](https://img.youtube.com/vi/NaeWfDCNmMM/0.jpg)](https://youtu.be/NaeWfDCNmMM)


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Voiceflow Discord

We can talk about this project on Discord
https://discord.gg/9JRv5buT39

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_kb-vf-zendesk&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_kb-vf-zendesk)

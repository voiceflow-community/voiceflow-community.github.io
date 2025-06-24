# Voice Call Timer

A Node.js service that monitors Voiceflow voice calls and automatically ends them based on custom time limits. Perfect for implementing usage limits based on user subscription tiers or managing call durations within your Voiceflow assistant.

## Features

- **Flexible Timing**: Set time limits before or during an active call
- **Dynamic Control**: Update time limits at any point during a conversation
- **Customizable Messages**: Set personalized end-of-call messages for each user
- **Privacy-Focused**: Phone numbers are obfuscated in logs
- **Webhook Integration**: Works seamlessly with Voiceflow's call webhook events
- **Clean Termination**: Polite pause and message before ending calls
- **Multiple Call Support**: Handle numerous concurrent calls with different time limits

## Use Cases

- Limit free-tier users to short calls while allowing premium users longer durations
- Create time-limited demos or trials of voice applications
- Implement automatic call termination for compliance or policy reasons
- Set different time restrictions based on conversation context

## Demo

<div>
  <a href="https://www.loom.com/share/3712f0e2fefb41df977927c43a3a27bd">
    <p>Voice Call Timer Demo - Watch Video</p>
  </a>
  <a href="https://www.loom.com/share/3712f0e2fefb41df977927c43a3a27bd">
    <img src="https://cdn.loom.com/sessions/thumbnails/3712f0e2fefb41df977927c43a3a27bd-f784f770f90e750f-full-play.gif" alt="Voice Call Timer Demo" width="300">
  </a>
</div>


## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in `.env`:
   ```
   PORT=3000
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   ```
4. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### Register Member

Registers a member with their call time limit before or during a call.

You want to be sure to pass the user phone number for the userID
(you can use the built in Voiceflow variable `{user_id}` to get
the user's phone number).

- **URL**: `/api/member`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "userID": "+33xxxxxxxxx",
    "duration": "5m",
    "endMessage": "Thank you for calling. Your time is up. Goodbye!"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```

**Parameters:**
- `userID` (required): The phone number of the user (use the `user_id` variable in Voiceflow)
- `duration`: Call time limit in format like "30s" (30 seconds) or "5m" (5 minutes). If not provided, defaults to 2 minutes.
- `endMessage`: A custom message to be spoken before ending the call (optional)

**Important Timing Behavior:**
- Time limits can be set at any point before or during a call
- If set before a call starts, the timer will begin when the call actually starts
- If set during an active call, the timer starts immediately from that moment
- You can update a time limit by calling this endpoint again with the same userID

### Call Webhook

Endpoint to receive Voiceflow call events.

- **URL**: `/api/call-webhook`
- **Method**: `POST`
- **Body**: Voiceflow webhook event object
- **Response**:
  ```json
  {
    "success": true
  }
  ```

## Voiceflow Integration

### Setting Up the Webhook

1. Login to your Voiceflow account
2. Open your voice agent project
3. Go to **Settings** > **Behavior** > **Voice**
4. In the **Call events webhook** section, paste your URL:
   - `https://your-service-url/api/call-webhook`


### Getting User ID in Voiceflow

The `userID` parameter in API calls should match the caller's phone number. In Voiceflow, you can access this using:

- Variable: `{user_id}` - This contains the caller's phone number
- Use this variable when making API calls to the timer service from Voiceflow

## Example API Requests

### Setting a time limit before a call

```bash
curl -X POST \
  http://localhost:3000/api/member \
  -H 'Content-Type: application/json' \
  -d '{
    "userID": "+33612345678",
    "duration": "5m",
    "endMessage": "Thank you for your call. Your 5-minute time limit has been reached. The call will now end."
  }'
```

### Setting a time limit during a call

```bash
curl -X POST \
  http://localhost:3000/api/member \
  -H 'Content-Type: application/json' \
  -d '{
    "userID": "+33612345678",
    "duration": "30s",
    "endMessage": "Your time is up. Goodbye!"
  }'
```

### Minimal example (only required fields)

```bash
curl -X POST \
  http://localhost:3000/api/member \
  -H 'Content-Type: application/json' \
  -d '{"userID": "+33612345678", "duration": "1m"}'
```

## Workflow

1. Configure your Voiceflow call events webhook to point to `https://your-service-url/api/call-webhook`
2. Apply time limits in one of two ways:
   - **Before call**: Register the user through the API before the call starts
   - **During call**: Make the API call during the conversation (from a Voiceflow API Step or a Function for example)
3. When the time limit is reached, the service will:
   - Pause briefly
   - Play the custom end message
   - Hang up the call
4. Call data is automatically cleaned up after the call ends

## Troubleshooting

- **Call not ending**: Verify Twilio credentials in `.env` file
- **Webhook not working**: Check Voiceflow webhook configuration is enabled
- **Timer not starting**: Ensure the userID in your API call matches the caller's phone number exactly

## Security Considerations

- This service obfuscates phone numbers in logs for privacy
- Store your Twilio credentials securely in the `.env` file (never commit this file to source control)
- Consider implementing authentication for the API endpoints in production

## License

ISC

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_voice-call-timer&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_voice-call-timer)

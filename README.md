# Frontline Networks — Discord Bot

Administration bot for the Frontline Networks Discord server.

## Features

- `/apply` — Creates a private `staff-application-00001` channel (increments each time)
- `/ticket` — Creates a private `ticket-fn0001` support channel (increments each time)
- `/store` — Shows store packages with link to website store
- `/website` — Shows website link with buttons
- `/help` — Lists all commands
- `/status` — Manual GMOD server status check
- `/warn` — Issue a warning (Mod+)
- `/mute` — Timeout a member (Mod+)
- `/unmute` — Remove timeout (Mod+)
- `/purge` — Bulk delete messages (Mod+)
- `/kick` — Kick a member (Senior Staff only)
- `/ban` — Ban a member (Senior Staff only)
- Auto-updating server status embed in designated channel (every 60s)

## Permission Levels

| Role | Commands |
|------|----------|
| Everyone | /apply, /ticket, /store, /website, /help, /status |
| Mod role | + /warn, /mute, /unmute, /purge |
| Senior Staff | + /kick, /ban, accept/deny applications |

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/frontline-bot.git
cd frontline-bot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create your .env file
```bash
cp .env.example .env
```
Edit `.env` and fill in your `BOT_TOKEN` and all other values.

### 4. Register slash commands
```bash
npm run deploy
```

### 5. Start the bot
```bash
npm start
```

## Deploying to Render

1. Push this repo to GitHub
2. Go to render.com → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Environment:** Node
5. Add all your `.env` values as Environment Variables in the Render dashboard
6. Deploy

Every time you push to GitHub, Render redeploys automatically.

## Adding your GMOD server

When your server is ready, update these in your Render environment variables:
```
GMOD_IP=your.server.ip
GMOD_PORT=27015
```

The status embed will automatically start showing live player counts.

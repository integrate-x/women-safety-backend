# Women's Safety Backend

Node.js and Express backend for an ESP32 + GPS emergency-alert prototype. It serves a small web dashboard and accepts SOS events over HTTP.

## Features

- `POST /api/sos`: receive a GPS emergency alert (API-key protected).
- `GET /api/alert`: read the latest alert (used by the dashboard).
- `POST /api/reset`: clear the current alert (API-key protected).
- `GET /api/health`: deployment health check.
- Static dashboard served from `public/index.html`.

## Run locally

Requirements: Node.js 20 or later.

```bash
npm install
```

Copy `.env.example` to `.env` and set a private API key:

```env
PORT=3000
API_KEY=your_long_random_secret
```

Start the server:

```bash
npm start
```

Open http://localhost:3000.

## Send a test alert

PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/sos" -Method POST -Headers @{"x-api-key"="YOUR_API_KEY"} -ContentType "application/json" -Body '{"latitude":22.5726,"longitude":88.3639}'
```

Read the latest alert at http://localhost:3000/api/alert.

## API

### POST /api/sos

Header: `x-api-key: YOUR_API_KEY`

JSON body:

```json
{
  "latitude": 22.5726,
  "longitude": 88.3639
}
```

### GET /api/alert

Returns the latest alert state. The dashboard polls this endpoint every three seconds.

### POST /api/reset

Header: `x-api-key: YOUR_API_KEY`. Clears the latest alert.

### GET /api/health

Returns a simple health status.

## Deploy to Render

This repository includes `render.yaml`. In Render, choose **New + → Blueprint**, connect this repository, and deploy the service. Render will generate the `API_KEY` environment variable from the blueprint. Copy the generated value from the Render service's environment settings and configure the same value in the ESP32 firmware.

After deployment, open the service's public `onrender.com` URL. The dashboard is at the root URL and the health endpoint is `/api/health`.

## Prototype limitations

The current alert is kept in server memory. It is lost when the server restarts or redeploys, and the service does not yet have a database, user accounts, alert history, SMS, or push notifications. The dashboard and API are a demonstration, not a monitored emergency-response service. Do not rely on this prototype for personal safety or real emergency dispatch.

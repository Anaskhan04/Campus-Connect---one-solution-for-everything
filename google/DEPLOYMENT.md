# Deployment Guide

This guide explains how to deploy the Campus Connect application to cloud platforms (like Heroku, Render, AWS, etc.).

## 1. Prerequisites

- A MongoDB Atlas database (or another MongoDB instance).
- Node.js installed.

## 2. Environment Variables

The following environment variables must be configured in your deployment environment:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Your MongoDB connection string. |
| `JWT_SECRET` | A long, random string used to sign authentication tokens. |
| `PORT` | (Optional) The port the server will listen on (defaults to 5000). |
| `NODE_ENV` | Set to `production`. |

## 3. Deployment Steps

### Step 1: Prepare the Code
Ensure you have the latest code and that all dependencies are installed in both the root and backend directories.

```bash
npm install
cd backend && npm install
```

### Step 2: Build (If applicable)
The application currently serves static files from the `frontend` directory. No separate build step is required for the frontend unless you introduce a bundler like Vite or Webpack later.

### Step 3: Start the Server
Cloud platforms usually run the `npm start` command.

```bash
# From the root directory
cd backend && npm start
```

## 4. Frontend-Backend Communication

The application is configured to handle communication automatically:
- **Backend**: Serves the frontend static files.
- **Frontend**: The `api.js` wrapper dynamically detects the hostname. In production, it assumes the API is available at the same host under the `/api` prefix.

## 5. Security Notes

- Ensure `JWT_SECRET` is kept private and is never committed to version control.
- In production, the `helmet` middleware is enabled to provide basic security headers.
- Rate limiting is active on all `/api` routes to prevent abuse.

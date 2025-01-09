ComPilot Transaction Monitoring Example - Backend TypeScript
========================================================

This example demonstrates how to build a backend server that handles transaction submissions and status updates using ComPilot's API. It includes real-time updates via WebSocket and webhook processing.

## Features

- Express.js REST API for transaction submission
- WebSocket server for real-time status updates
- Webhook handler for ComPilot callbacks
- Support for both Crypto and Fiat transactions
- Transaction status tracking

## Prerequisites

- Access to ComPilot dashboard with an API key
- A transaction monitoring workflow set up in your workspace
- Node.js and npm/yarn installed
- ngrok for webhook testing

## Getting Started

1. Install dependencies:
```bash
yarn/npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
# API Configuration
COMPILOT_API_URL=https://api.compilot.ai
COMPILOT_API_KEY=your_api_key

# Server Configuration
PORT=8080
NODE_ENV=development

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret
WEBHOOK_URL=https://[your-ngrok-url]/api/webhooks/compilot
```

4. Start ngrok tunnel:
```bash
ngrok http 8080
```

5. Update the WEBHOOK_URL in `.env` with your ngrok URL

6. Build and start the server:
```bash
yarn build
yarn start
```

## Project Structure

```
src/
├── controllers/        # Request handlers
│   ├── transactions.ts # Transaction submission
│   └── webhooks.ts    # Webhook processing
├── services/          # Business logic
│   └── compilot.ts    # ComPilot API integration
├── routes/            # API routes
├── types/            # TypeScript definitions
└── websocket/        # WebSocket handling
```

## API Endpoints

- `POST /api/transactions` - Submit a new transaction
- `POST /api/webhooks/compilot` - Webhook endpoint for status updates
- `WS /ws` - WebSocket endpoint for real-time updates

## Documentation

- [ComPilot Documentation](https://docs.compilot.ai)
- [API Reference](https://docs.compilot.ai/developing/api/)

## Related

- [Frontend Implementation](../frontend)
- [Backend Python Implementation](../backend-python) 
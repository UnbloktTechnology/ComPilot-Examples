ComPilot Customer Screening Example - Backend TypeScript
====================================================

This example demonstrates how to build a backend server that handles customer screening and status updates using ComPilot's API. It includes real-time updates via WebSocket and webhook processing.

## Features

- Express.js REST API for customer screening
- WebSocket server for real-time status updates
- Webhook handler with SVIX signature verification
- Support for Individual and Business customers
- Customer screening status tracking and broadcasting

## Prerequisites

- Access to ComPilot dashboard with an API key
- A customer screening workflow set up in your workspace
- Node.js and npm/yarn installed
- ngrok for webhook testing

## Project Structure

```
src/
├── controllers/
│   ├── WebhookController.ts    # Webhook handling and verification
│   └── customers.ts            # Customer screening submission
├── services/
│   └── compilot.ts            # ComPilot API integration
├── routes/
│   ├── customers.ts           # Customer routes
│   └── webhookRoutes.ts       # Webhook routes
├── websocket/
│   └── index.ts              # WebSocket server implementation
└── types/
    └── customer.ts           # Type definitions
```

## Getting Started

1. Install dependencies:
```bash
yarn install
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

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret

# Workflow ID
COMPILOT_SCREENING_WORKFLOW_ID=your_workflow_id

# Server Configuration
PORT=8080
NODE_ENV=development
```

4. Start ngrok tunnel:
```bash
ngrok http 8080
```

5. Configure webhook URL in ComPilot dashboard with your ngrok URL

6. Start the server:
```bash
yarn dev
```

## API Endpoints

### Customer Screening
```http
POST /api/customers
Content-Type: application/json

{
  "workspaceId": "your_workspace_id",
  "organizationId": "your_organization_id",
  "workflowId": "your_workflow_id"
}
```

### Webhook Endpoint
```http
POST /
```
Handles ComPilot webhook events with SVIX signature verification.

### WebSocket
```
WS /ws
```
Provides real-time customer screening status updates to connected clients.

## Documentation

- [ComPilot Documentation](https://docs.compilot.ai)
- [API Reference](https://docs.compilot.ai/developers/api)

## Related

- [Frontend Implementation](../frontend)
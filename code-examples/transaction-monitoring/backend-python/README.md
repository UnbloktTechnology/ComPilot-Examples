ComPilot Transaction Monitoring Example - Backend Python
====================================================

This example demonstrates how to build a backend server that handles transaction submissions and status updates using ComPilot's API. It includes real-time updates via WebSocket and webhook processing.

## Features

- Flask REST API for transaction submission
- Flask-Sock for WebSocket support
- Webhook handler with SVIX signature verification
- Support for both Crypto and Fiat transactions
- Transaction status tracking and broadcasting

## Prerequisites

- Access to ComPilot dashboard with an API key
- A transaction monitoring workflow set up in your workspace
- Python 3.8+ installed
- ngrok for webhook testing

## Project Structure

```
backend-python/
├── controllers/
│   └── webhooks.py         # Webhook handling and verification
├── services/
│   └── compilot.py         # ComPilot API integration
├── app.py                  # Main Flask application
└── types/
    └── transaction.py      # Type definitions
```

## Getting Started

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
# API Configuration
COMPILOT_API_URL=https://api.compilot.ai
COMPILOT_API_KEY=your_api_key

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret
WEBHOOK_URL=https://[your-ngrok-url]/api/webhooks/compilot

# Workflow ID
COMPILOT_TMS_WORKFLOW_ID=your_workflow_id

# Server Configuration
FLASK_APP=app
FLASK_ENV=development
PORT=8080
```

5. Start ngrok tunnel:
```bash
ngrok http 8080
```

6. Update the WEBHOOK_URL in `.env` with your ngrok URL

7. Start the server:
```bash
flask run --port 8080
```

## API Endpoints

### Transaction Submission
```http
POST /api/workflows/:workflowId/transactions
Content-Type: application/json

{
  "transactionType": "crypto",
  "transactionSubType": "wallet transfer",
  "transactionInfo": {
    "direction": "IN",
    "amount": 0.5,
    "currencyCode": "ETH"
  }
  // ... see transaction.py for full schema
}
```

### Webhook Endpoint
```http
POST /api/webhooks/compilot
```
Handles ComPilot webhook events with SVIX signature verification.

### WebSocket
```
WS /ws
```
Provides real-time transaction status updates to connected clients.

## WebSocket Integration

The server uses Flask-Sock for WebSocket support:
- Maintains a set of active connections
- Broadcasts webhook updates to all connected clients
- Handles connection/disconnection events

## Documentation

- [ComPilot Documentation](https://docs.compilot.ai)
- [API Reference](https://docs.compilot.ai/apis/)

## Related

- [Frontend Implementation](../frontend)
- [Backend TypeScript Implementation](../backend-typescript) 
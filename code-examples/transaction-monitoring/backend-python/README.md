ComPilot Transaction Monitoring Example - Backend Python
===================================================

This example demonstrates how to build a backend server that handles transaction submissions and status updates using ComPilot's API. It provides the same functionality as the TypeScript version but implemented in Python using Flask.

## Features

- Flask REST API for transaction submission
- WebSocket support with Flask-Sock
- Webhook handler for ComPilot callbacks
- Support for both Crypto and Fiat transactions
- Transaction status tracking

## Prerequisites

- Access to ComPilot dashboard with an API key
- A transaction monitoring workflow set up in your workspace
- Python 3.x installed
- ngrok for webhook testing

## Getting Started

1. Create and activate virtual environment:
```bash
# Create venv
python3 -m venv venv

# Activate venv
# On Mac/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
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
```bash
# API Configuration
COMPILOT_API_URL=https://api.compilot.ai
COMPILOT_API_KEY=your_api_key

# Server Configuration
FLASK_APP=app
FLASK_ENV=development
PORT=3001

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret
WEBHOOK_URL=https://[your-ngrok-url]/api/webhooks/compilot
```

5. Start ngrok tunnel:
```bash
ngrok http 3001
```

6. Update the WEBHOOK_URL in `.env` with your ngrok URL

7. Start the server:
```bash
python app.py
```

## Project Structure

```
backend-python/
├── controllers/        # Request handlers
│   └── webhooks.py    # Webhook processing
├── services/          # Business logic
│   └── compilot.py    # ComPilot API integration
├── app.py            # Main application
└── requirements.txt  # Python dependencies
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
- [Backend TypeScript Implementation](../backend-typescript) 
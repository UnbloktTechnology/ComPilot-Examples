# ComPilot Transaction Monitoring Example

This example demonstrates how to implement transaction monitoring using ComPilot's API. It includes:

- Real-time transaction status updates via WebSocket
- Webhook handling with signature verification
- Frontend visualization of transaction status and history
- Example implementations in both TypeScript and Python

## Structure

```
                                    ┌─────────────────┐
                                    │                 │
                                    │  ComPilot API   │
                                    │                 │
                                    └────────┬────────┘
                                            │
                                            │ Webhooks
                    API Calls               │
                         ┌──────────────────┘
                         │
                         ▼
┌────────────┐    ┌───────────────┐    ┌─────────────┐
│            │    │               │    │             │
│  Frontend  │◄──►│    Backend    │◄──►│    ngrok    │
│            │    │ (TS or Python)│    │             │
└────────────┘    └───────────────┘    └─────────────┘
     ▲                    ▲
     │                    │
     └────────────────────┘
       WebSocket Updates
```

## Components

### Frontend (Next.js)
- Provides the user interface for testing transactions
- Displays real-time transaction status via WebSocket
- Shows detailed transaction logs
- Located in `/frontend`

### Backend (Choose one)
1. TypeScript Implementation (`/backend-typescript`)
   - Built with Express.js
   - Uses native WebSocket

2. Python Implementation (`/backend-python`)
   - Built with Flask
   - Uses Flask-Sock for WebSocket

## Data Flow

1. **Transaction Submission**
   - Frontend sends transaction data to backend (`POST /api/transactions`)
   - Backend forwards request to ComPilot API
   - ComPilot returns transaction ID
   - Frontend displays "pending" status

2. **Status Updates**
   - ComPilot sends webhook to backend via ngrok
   - Backend broadcasts update via WebSocket
   - Frontend updates UI in real-time

 **Transaction Types**
   - Crypto: Incoming/Outgoing wallet transfers (ETH, MATIC, etc.)
   - Fiat: Bank transfers and card payments (EUR, USD, etc.)
   - All transactions include fees and relevant transaction info
   - Status flow: pending → processing → completed/failed

For detailed transaction type definitions, see [transaction.ts](./frontend/src/types/transaction.ts)

## Setup Requirements

1. **ComPilot Account**
   - API Key
   - Webhook Secret
   - Transaction Monitoring workflow

2. **Development Tools**
   - Node.js (for frontend and TypeScript backend)
   - Python 3.x (for Python backend)
   - ngrok (for webhook testing)

## Getting Started

1. Choose your backend implementation (TypeScript or Python)
2. Set up the selected backend following its README
3. Configure the frontend to point to your chosen backend
4. Start both services

For detailed setup instructions, see:
- [Frontend README](./frontend/README.md)
- [TypeScript Backend README](./backend-typescript/README.md)
- [Python Backend README](./backend-python/README.md)

## Documentation

- [ComPilot Documentation](https://docs.compilot.ai)
- [API Reference](https://docs.compilot.ai/developing/api/) 
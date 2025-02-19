# ComPilot Customer Screening Example

This example demonstrates how to implement customer screening using ComPilot's API. It includes:

- Real-time customer status updates via WebSocket
- Webhook handling with signature verification
- Frontend visualization of screening status
- Example implementation in TypeScript

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
│            │    │  (TypeScript) │    │             │
└────────────┘    └───────────────┘    └─────────────┘
     ▲                    ▲
     │                    │
     └────────────────────┘
       WebSocket Updates
```

## Components

### Frontend (Next.js)
- Provides the developer interface for testing customer screening
- Displays real-time status updates via WebSocket
- Shows detailed webhook logs
- Located in `/frontend`

### Backend (TypeScript)
- Built with Express.js
- Uses native WebSocket
- Located in `/backend-typescript`

## Data Flow

1. **Customer Submission**
   - Frontend sends customer data to backend (`POST /workflows/{workflowID}/customers`)
   - Backend forwards request to ComPilot API
   - ComPilot returns 200 OK
   - Frontend displays initial status

2. **Status Updates**
   - ComPilot sends webhook to backend via ngrok
   - Backend broadcasts update via WebSocket
   - Frontend updates UI in real-time

## Setup Requirements

1. **ComPilot Account**
   - API Key
   - Webhook Secret
   - Customer Screening workflow
   - CMS Project ID

2. **Development Tools**
   - Node.js
   - ngrok (for webhook testing)

## Getting Started

1. Set up the backend following its README
2. Configure the frontend to point to your backend
3. Start both services

For detailed setup instructions, see:
- [Frontend README](./frontend/README.md)
- [Backend TypeScript README](./backend-typescript/README.md)

## Documentation

- [ComPilot Documentation](https://docs.compilot.ai)
- [API Reference](https://docs.compilot.ai/developers/api)
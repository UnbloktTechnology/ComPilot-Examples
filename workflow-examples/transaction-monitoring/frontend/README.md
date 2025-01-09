ComPilot Transaction Monitoring Example - Frontend
===============================================

This example demonstrates how to build a transaction monitoring interface using Next.js and ComPilot's API. It provides a developer-friendly environment to test and monitor transactions in real-time.

## Features

- Real-time transaction status monitoring via WebSocket
- Support for both Crypto and Fiat transactions
- Developer mode for testing transaction flows
- Transaction log with detailed API requests and responses
- Webhook status visualization

## Prerequisites

- Access to ComPilot dashboard with an API key
- A transaction monitoring workflow set up in your workspace
- A customer ID (you can find it in the ComPilot dashboard), if no customer ID is provided, you will need to create a KYC workflow in your workspace and use it to create one customer.
- Node.js and npm/yarn installed
- Backend server (TypeScript or Python) running

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration:
```env
# For TypeScript backend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# For Python backend
# NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
# NEXT_PUBLIC_WS_URL=ws://localhost:3001

NEXT_PUBLIC_CUSTOMER_ID=your_customer_id
```

4. Start the development server:
```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Project Structure

```
src/
├── components/          # React components
│   ├── DevMode.tsx     # Transaction testing interface
│   └── ...
├── lib/                # Utilities and constants
├── types/              # TypeScript definitions
└── app/                # Next.js app router
```

## Documentation

- [ComPilot Documentation](https://docs.compilot.ai)
- [Transaction Monitoring Guide]()
- [API Reference](https://docs.compilot.ai/developing/api/)

## Related

- [Backend TypeScript Implementation](../backend-typescript)
- [Backend Python Implementation](../backend-python)

ComPilot Customer Screening Example - Frontend
===============================================

This example demonstrates how to build a customer screening interface using Next.js and ComPilot's API. It provides a developer-friendly environment to test and monitor customer screening in real-time.

## Features

- Real-time customer screening status monitoring via WebSocket
- Developer mode for testing screening flows
- Detailed webhook logs and status visualization

## Prerequisites

- Access to ComPilot dashboard
- A customer screening workflow set up in your workspace
- Node.js and npm/yarn installed
- Backend server running

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
# Backend URLs
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# ComPilot Configuration
NEXT_PUBLIC_WORKFLOW_ID=
NEXT_PUBLIC_CMS_PROJECT_ID=
```

4. Start the development server:
```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Project Structure

```
src/
├── app/
│   └── page.tsx                # Main application page
├── components/
│   ├── CustomerScreeningInspector.tsx  # Developer mode interface
│   └── lifecycleinspectorsection/      # Inspector components
│       ├── JsonEditorSection.tsx       # JSON payload editor
│       ├── LogSection.tsx              # Webhook logs display
│       ├── StatusDisplaySection.tsx    # Status visualization
│       └── WebhookSection.tsx          # Webhook monitoring
├── hooks/
│   ├── useCustomerApi.ts       # API integration
│   └── useCustomerWebSocket.ts # Real-time updates
├── lib/
│   ├── customer-examples.ts    # Customer templates
│   └── generators.ts          # Test data generators
└── types/
    └── devmode.ts            # Developer mode types
```

## Developer Mode Features

### Customer Screening Inspector
- JSON editor for customer payload
- Real-time API response viewing
- Detailed webhook logs
- Screening status monitoring
- Test data generation

### Webhook Monitoring
- Real-time webhook visualization
- Status change tracking
- Full webhook payload inspection
- Connection status monitoring

## Documentation

- [ComPilot Documentation](https://docs.compilot.ai)
- [API Reference](https://docs.compilot.ai/developers/api)

## Related

- [Backend TypeScript Implementation](../backend-typescript)
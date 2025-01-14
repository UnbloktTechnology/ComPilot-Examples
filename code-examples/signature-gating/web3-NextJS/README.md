# ComPilot Signature Gating Frontend Example

This example demonstrates how to integrate ComPilot's signature gating features in a Next.js application. It shows two different approaches: direct API integration and SDK usage.

## Implementation Overview

The application implements a complete token minting flow with KYC verification:

1. **User Status Management**
   - Wallet connection using RainbowKit
   - KYC status verification through ComPilot API
   - Custom hook (`useCustomerCheck`) for status tracking

2. **Minting Implementation**
   - `MintButton.tsx`: Direct API integration example
   - `MintButtonSDK.tsx`: SDK-based implementation
   - Real-time transaction status updates

3. **API Routes**
   - `/api/customer`: Handles KYC status verification
   - `/api/tx-auth-signature`: Manages signature requests

## Prerequisites

To run this example, you need:
- Access to ComPilot dashboard with an API key
- A KYC workflow set up in your workspace
- A smart contract deployed on EVM compatible network
- A smart contract workflow set up in your compilot workspace
- Node.js v16 or higher


## Environment Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Required variables:

# ComPilot API Authentication
API_KEY                # Your ComPilot API key from dashboard
WEBHOOK_SECRET           # Optional: Your webhook secret if using webhooks

# Workflow Configuration
WORKFLOW_KYC_ID           # ID of your KYC workflow from ComPilot dashboard
NEXT_PUBLIC_WORKFLOW_GATING_ID  # ID of your smart contract gating workflow

# Project Configuration
COMPILOT_PROJECT_ID       # Your ComPilot project ID from dashboard

# Smart Contract Configuration
NEXT_PUBLIC_GATED_TOKEN_ADDRESS  # Address of your deployed gated token contract


## Running the Application

Start the development server:
```bash
npm run dev
```

## Key Features

- Dual integration methods showcase
- KYC status management
- Signature verification flow

## Learn More

- [ComPilot Documentation](https://docs.compilot.dev)
- [SDK Documentation](https://docs.compilot.dev/sdk)
- [API Reference](https://docs.compilot.dev/reference)
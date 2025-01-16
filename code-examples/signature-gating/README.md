# ComPilot Signature Gating Example

## Overview

This example demonstrates how to implement signature-based token minting using ComPilot's features. It showcases both smart contract implementation and web interface integration.

## Project Structure

```
signature-gating/
├── smart-contracts/     # Solidity contracts and deployment scripts
└── web3-NextJS/        # Next.js frontend application
```

## Features

- Signature-gated token minting
- KYC verification flow
- Real-time transaction status
- Dual integration methods:
  - Direct API integration
  - SDK implementation

## Prerequisites

1. **Node.js**: v16 or higher
2. **Wallet**: MetaMask or any Web3 wallet
3. **Test MATIC Tokens**: Required for transactions
   - Visit [Polygon Faucet](https://faucet.polygon.technology/)
   - Connect your wallet
   - Request test MATIC tokens
   - Wait a few minutes for tokens to arrive

## Network Information

This example uses Polygon Amoy testnet:
- Network Name: Polygon Amoy
- RPC URL: https://rpc-amoy.polygon.technology
- Chain ID: 80002
- Currency Symbol: MATIC

but feel free to use any other network supported by ComPilot (https://docs.compilot.ai/developing/gating/smartcontract) : for more information on compatibility

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd signature-gating
```

2. Setup each component:
- Follow [Smart Contracts Setup](./smart-contracts/README.md)
- Follow [Web Interface Setup](./web3-NextJS/README.md)

## Learn More

For detailed information about ComPilot's features and integration:
- [ComPilot Documentation](https://docs.compilot.ai)
- [API Reference](https://docs.compilot.ai/apis)
- [SDK Documentation](https://docs.compilot.ai/developing/sdk/)

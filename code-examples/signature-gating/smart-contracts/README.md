# ComPilot Signature Gating Smart Contracts

Smart contract implementation for ComPilot's signature-based token gating system.

## Contract Overview

The main contract (`GatedToken.sol`) implements:
- ERC20 token functionality
- Signature verification for minting by Compilot signature gating system
- Integration with ComPilot's signer system

## Prerequisites

- Node.js v16 or higher
- Access to ComPilot dashboard
- Test MATIC tokens for deployment

## Environment Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

Required variables:
- `PRIVATE_KEY`: Deployer wallet private key
- `NETWORK_RPC_URL`: Network RPC URL (defaults to Polygon Amoy)
- `SIGNER_MANAGER_ADDRESS`: ComPilot's signer manager address

## Deployment

Deploy to Polygon Amoy testnet:
```bash
npx hardhat run scripts/deploy.ts --network polygonAmoy
```

## Contract Verification

After deployment, verify your contract:
```bash
npx hardhat verify --network polygonAmoy <CONTRACT_ADDRESS> <SIGNER_MANAGER_ADDRESS>
```

## Network Configuration

Default network is Polygon Amoy testnet:
- RPC URL: https://rpc-amoy.polygon.technology
- Chain ID: 80002
- Currency: MATIC

## Security Notes

- All minting operations require valid ComPilot signatures
- Signatures are single-use and transaction-specific
- Keep your private keys and API keys secure
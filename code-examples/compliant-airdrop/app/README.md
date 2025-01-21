# Airdrop Platform Frontend

This folder contains the frontend application for the Airdrop Platform. It's built using Next.js and integrates with the smart contracts deployed in the `contracts` folder and the ComPilot Identity SDK for KYC/AML compliance.

## Features

- User-friendly interface for airdrop participants
- Wallet connection and management
- Eligibility checking for airdrop claims
- Integration with ComPilot for identity verification
- Airdrop claiming process

## Setup

1. Navigate to the `app` folder
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required values, including contract addresses and API keys

## Running the Application

To run the development server:

1. Start the database:
   ```
   npm run db:start
   ```
2. Start the Next.js application:
   ```
   npm run dev
   ```

## Configure a smart contract deployment

To configure a smart contract deployment, you can edit the `src/kyc-airdrop/config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES.ts` file and set the `CUSTOMER_BALANCE_MAP` and `CUSTOMER_ALLOWLIST` variables to the values you want to use.

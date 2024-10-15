# Airdrop Platform Smart Contracts

This repository contains the smart contracts for the Airdrop Platform. The main components are:

1. **MerkleDistributor**: The core contract that handles the airdrop distribution using a Merkle tree for efficient and gas-optimized claiming.
1. **MerkleDistributorWithDeadline**: A variant of MerkleDistributor that includes a deadline for the airdrop claiming process.
1. **MerkleDistributorFactory**: A factory contract that deploys new instances of MerkleDistributor and MerkleDistributorWithDeadline.

The Merkle tree approach allows for a large number of recipients to be included in the airdrop while keeping gas costs low for both deployment and claiming.

Key features:

- Efficient airdrop distribution using Merkle proofs
- Flexible claiming process with optional time-based restrictions
- Integration with ComPilot for KYC/AML compliance

The contracts are written in Solidity and use the Hardhat development environment for testing, deployment, and verification.

## Setup

1. Navigate to the `contracts` folder
2. Install dependencies

`npm install`

3. Replace `inputFiles/listInput.csv` with your CSV file of addresses with corresponding amounts
4. Add your networks to hardhat.config.ts and package.json like we did for Sepolia and Amoy
5. Set up env
   a. DEPLOYMENT_MNEMONIC with your deployment mnemonic
   b. TX_SIGNER_ADDRESS with our prod signing address: "0x03DF23c4dEA7B52Daf9B7920Ec6CFeDFFA691689"
   c. set DEPLOY_ROOT to "local" to use your input allowList
   d. add rpc providers url such as AMOY_PROVIDER_URL or SEPOLIA_PROVIDER_URL
6. Run deployment command `npm run deploy-{nameOfNetwork}` as shown in package.json
   Alternatively if you want to deploy a factory contract, run `npm run deploy-factory-{nameOfNetwork}`
7. Use the generated file `./outputFiles/allowListObj.json` in your front end to generate merkle proofs to claim tokens, as per shown in our example (the order of the keys matter in this case).

## Local Development

The following assumes the use of `node@>=20`.

### Install Dependencies

`npm install`

### Compile Contracts

`npm run compile`

### Run Tests

`npm test`

## Deployments

Run `npm run deploy-polygonAmoy`or `npm run deploy-sepolia`

### Amoy

**Live**

Example token deployed at 0x4Ae0B2Ed56b681ABcfb19A6aAAb921b35b531276

merkleDistributor deployed at 0x3d95361Fa0d4E83Ac553b359197748baA1226307

**Local Testing**

Example token deployed at 0x20487A4F07B733f6Ed4DCF61AceEC0D647c521eC

merkleDistributor deployed at 0x3703eF2fF956E80a4392Cd53dB1880891075B364

### Sepolia

**Live**

Example token deployed at 0x48182d21869b874BabdeCC0851dDA4F89B18a687

merkleDistributor deployed at 0x96caF7D5DD0304976A070804074E453887BE509c

**Local Testing**

Example token deployed at 0x77DEBBF6Bb3A1F899333ef096217505DDC80433c

merkleDistributor deployed at 0x130089FD95cD9Ff9119d0Df3afdbC6dA1bB87045

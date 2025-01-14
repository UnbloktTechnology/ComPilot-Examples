/**
 * @file hardhat.config.ts
 * @description Hardhat configuration for smart contract deployment
 * 
 * Configuration includes:
 * 1. Network settings for Polygon Amoy testnet
 * 2. Solidity compiler version
 * 3. Environment variables for secure deployment
 * 
 * @requires @nomicfoundation/hardhat-toolbox - For deployment tools
 * @requires dotenv - For environment variables
 */

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';

/**
 * @type HardhatUserConfig
 * Networks:
 * - polygonAmoy: Polygon Amoy testnet configuration
 *   Uses fallback RPC URL if not provided in env
 */
const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    polygonAmoy: {
      url: process.env.NETWORK_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002
    }
  }
};

export default config; 
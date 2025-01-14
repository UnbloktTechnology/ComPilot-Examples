/**
 * @file deploy.ts
 * @description Deployment script for GatedToken contract
 * 
 * This script:
 * 1. Deploys GatedToken contract to network
 * 2. Uses ComPilot's signer manager address
 * 3. Logs deployment information
 * 
 * @requires hardhat-ethers - For deployment
 * @requires process.env.PRIVATE_KEY - Deployer wallet private key
 */

import { ethers } from "hardhat";

async function main() {
  console.log("Deploying with account:", (await ethers.getSigners())[0].address);

  /**
   * ComPilot Signer Manager Address
   * Used for signature verification in contract
   */
  const COMPILOT_SIGNER_MANAGER = "0x29A75f22AC9A7303Abb86ce521Bb44C4C69028A0";

  /**
   * Contract Deployment
   * Deploys GatedToken with ComPilot signer
   */
  const GatedToken = await ethers.deployContract("GatedToken", [COMPILOT_SIGNER_MANAGER]);
  await GatedToken.waitForDeployment();

  console.log("GatedToken deployed to:", await GatedToken.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 
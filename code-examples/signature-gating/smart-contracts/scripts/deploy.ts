import { ethers } from "hardhat";

async function main() {
  const COMPILOT_SIGNER_MANAGER = "0x29A75f22AC9A7303Abb86ce521Bb44C4C69028A0";  // ComPilot's address

  const GatedToken = await ethers.deployContract("GatedToken", [COMPILOT_SIGNER_MANAGER]);
  await GatedToken.waitForDeployment();

  console.log("GatedToken deployed to:", await GatedToken.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 
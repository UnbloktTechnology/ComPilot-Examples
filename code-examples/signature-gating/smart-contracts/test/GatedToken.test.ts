import { expect } from "chai";
import { ethers } from "hardhat";

describe("GatedToken", function () {
  const COMPILOT_SIGNER_MANAGER = "0x29A75f22AC9A7303Abb86ce521Bb44C4C69028A0";

  it("Should deploy with correct name and symbol", async function () {
    const token = await ethers.deployContract("GatedToken", [COMPILOT_SIGNER_MANAGER]);
    await token.waitForDeployment();

    expect(await token.name()).to.equal("Gated Token");
    expect(await token.symbol()).to.equal("GTK");
  });

  it("Should revert when minting without authorization", async function () {
    const [owner, recipient] = await ethers.getSigners();
    const token = await ethers.deployContract("GatedToken", [COMPILOT_SIGNER_MANAGER]);
    await token.waitForDeployment();

    const mintAmount = 100n;
    const tx = token.interface.encodeFunctionData("mint", [recipient.address, mintAmount]);
    
    await expect(
      token.mint(recipient.address, mintAmount, "0x")
    ).to.be.revertedWith("TxAuthDataVerifier: Invalid signature");
  });
}); 
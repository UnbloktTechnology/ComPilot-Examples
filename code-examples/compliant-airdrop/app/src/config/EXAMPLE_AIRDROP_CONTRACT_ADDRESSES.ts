import { type Environment } from "@nexeraid/identity-schemas";
import type { Address } from "viem";

import { env } from "@/env.mjs";
import { EvmChainId } from "@compilot/react-sdk";
import { type BalanceMap } from "@compilot/merkle-tree-js";

import allowListObj from "./allowListObj.json";

export const CUSTOMERS_BALANCE_MAP: BalanceMap[] = allowListObj.balances;

export const getDistributorContractAddress = () => {
  const distributorAddress =
    EXAMPLE_AIRDROP_CONTRACT_ADDRESSES[env.NEXT_PUBLIC_ENVIRONMENT]
      ?.merkleDistributorAddress;
  if (!distributorAddress) {
    throw new Error("Distributor address not found");
  }
  return distributorAddress;
};

export const getAirdropTokenConfig = () => {
  const tokenAddress =
    EXAMPLE_AIRDROP_CONTRACT_ADDRESSES[env.NEXT_PUBLIC_ENVIRONMENT]
      ?.tokenAddress;
  if (!tokenAddress) {
    throw new Error("Token address not found");
  }
  return {
    address: tokenAddress,
    symbol: "PEAQ-TESTNET",
    displayName: "PEAQ",
    decimals: 18,
  };
};

export const getDeploymentChain = () => {
  return {
    id: 80002,
    name: "Polygon Amoy",
    parsedId: EvmChainId.parse("80002"),
  };
};

// Contract addresses for different environments and chains
const EXAMPLE_AIRDROP_CONTRACT_ADDRESSES: {
  [key in Environment]: Partial<{
    tokenAddress: Address;
    merkleDistributorAddress: Address;
  }>;
} = {
  local: {
    tokenAddress: "0xe19fA0CcD51353c2646881D096b18F53cEF22453",
    merkleDistributorAddress: "0x97A28EcA052ecC99C10386236b2d949DAA850D56",
  },
  cicd: {
    tokenAddress: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
    merkleDistributorAddress: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
  },
  "test-dev-1": {
    tokenAddress: "0x6Febb483511702Ccf3a0f5a0b503C8C3D6Dd383A",
    merkleDistributorAddress: "0xefAd1faC927aBc388E8bFbEf6b97509cdb9d65BF",
  },
  "test-dev-2": {
    tokenAddress: "0x6Febb483511702Ccf3a0f5a0b503C8C3D6Dd383A",
    merkleDistributorAddress: "0xefAd1faC927aBc388E8bFbEf6b97509cdb9d65BF",
  },
  "test-dev-3": {
    tokenAddress: "0x6Febb483511702Ccf3a0f5a0b503C8C3D6Dd383A",
    merkleDistributorAddress: "0xefAd1faC927aBc388E8bFbEf6b97509cdb9d65BF",
  },
  "test-dev-4": {
    tokenAddress: "0x6Febb483511702Ccf3a0f5a0b503C8C3D6Dd383A",
    merkleDistributorAddress: "0xefAd1faC927aBc388E8bFbEf6b97509cdb9d65BF",
  },
  dev: {
    tokenAddress: "0xecbBA2f4370818e7129a8cE2F7402D7860C1dB0E",
    merkleDistributorAddress: "0xE322d2d90a6327533032f45410E1c47e862ef868",
  },
  stage: {
    tokenAddress: "0x22dB8f9cBa5A9A5100B69bbd61f6d08f560D8C96",
    merkleDistributorAddress: "0xDd50cFac7Cae728723307aaAaFb62716dDA77551",
  },
  prod: {
    tokenAddress: "0x2E9d4E7563400DA9eEdF79ff51124C41a47Bf082",
    merkleDistributorAddress: "0x9D78c9d1c25748DB49388Ab1250d1779C6871e15",
  },
} as const;

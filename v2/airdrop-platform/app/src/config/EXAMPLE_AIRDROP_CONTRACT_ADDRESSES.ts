import { type Environment } from "@nexeraid/identity-schemas";
import type { Address } from "viem";

import { env } from "@/env.mjs";
import { EvmChainId } from "@compilot/react-sdk";

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
  return { address: tokenAddress, symbol: "PEAQ", decimals: 18 };
};

export const getDeploymentChain = () => {
  return { id: 80002, name: "Polygon Amoy", parsedId: EvmChainId.parse(80002) };
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
  dev: {
    tokenAddress: "0x6fE18a32Fc0b31b18f357Df3f2AEC7e53B252c4A",
    merkleDistributorAddress: "0x1108095730893563f8Fd894B7FFbE0e75993A651",
  },
  stage: {
    tokenAddress: "0x9bBB37a7c289F767a333EEEFa7e69cD5122ad53F",
    merkleDistributorAddress: "0x743a70CbdB499DE763ce43512De15c185d044661",
  },
  prod: {
    tokenAddress: "0x6Cc34F653aafCa532D511fBFd8033C4791Da75FA",
    merkleDistributorAddress: "0x2071Db82ECa06711e88bF4B753f95403D678d0dF",
  },
} as const;

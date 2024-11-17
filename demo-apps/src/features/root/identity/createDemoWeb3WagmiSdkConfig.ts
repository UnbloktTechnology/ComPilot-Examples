import { createConfig, createWeb3AuthAdapter } from "@compilot/react-sdk";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { wagmiConfig } from "@/features/root/web3/wagmiConfig";

import "@/features/root/configureReactDemoEnv";
import { createWagmiWalletAdapter } from "@compilot/web-sdk-wallet-wagmi";

export const createDemoWeb3WagmiSdkConfig = (
  demoApp:
    | "multi-chain-support"
    | "bank"
    | "bank-kyb"
    | "bank-web3"
    | "defi-offchain-zkp"
    | "defi-rule-engine"
    | "kyc",
) =>
  createConfig({
    authAdapter: createWeb3AuthAdapter({
      wallet: createWagmiWalletAdapter(wagmiConfig),
      generateChallenge: createDemoAppGenerateChallengeCallback(demoApp),
    }),
  });

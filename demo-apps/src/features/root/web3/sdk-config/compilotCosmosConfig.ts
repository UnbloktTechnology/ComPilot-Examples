import { createConfig, createWeb3AuthAdapter } from "@compilot/react-sdk";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { cosmosWalletConfig } from "@/features/root/web3/sdk-wallet/cosmosWallet";

import "@/features/root/configureReactDemoEnv";

export const compilotCosmosConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: cosmosWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback(
      "multi-chain-support",
    ),
  }),
});

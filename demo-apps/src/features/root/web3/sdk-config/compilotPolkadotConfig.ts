import { createConfig, createWeb3AuthAdapter } from "@compilot/react-sdk";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { polkadotWalletConfig } from "@/features/root/web3/sdk-wallet/polkadotWallet";

import "@/features/root/configureReactDemoEnv";

export const compilotPolkadotConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: polkadotWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback(
      "multi-chain-support",
    ),
  }),
});

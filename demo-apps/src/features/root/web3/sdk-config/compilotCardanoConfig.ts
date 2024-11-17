import { createConfig, createWeb3AuthAdapter } from "@compilot/react-sdk";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { cardanoWalletConfig } from "@/features/root/web3/sdk-wallet/cardanoWallet";

import "@/features/root/configureReactDemoEnv";

export const compilotCardanoConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: cardanoWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback(
      "multi-chain-support",
    ),
  }),
});

import { createConfig, createWeb3AuthAdapter } from "@compilot/react-sdk";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { tezosWalletConfig } from "@/features/root/web3/sdk-wallet/tezosWallet";

import "@/features/root/configureReactDemoEnv";

export const compilotTezosConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: tezosWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback(
      "multi-chain-support",
    ),
  }),
});

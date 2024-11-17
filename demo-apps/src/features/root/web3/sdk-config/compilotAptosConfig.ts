import { createConfig, createWeb3AuthAdapter } from "@compilot/react-sdk";
import { aptosWalletConfig } from "@/features/root/web3/sdk-wallet/aptosWallet";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";

import "@/features/root/configureReactDemoEnv";

export const compilotAptosConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: aptosWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback(
      "multi-chain-support",
    ),
  }),
});

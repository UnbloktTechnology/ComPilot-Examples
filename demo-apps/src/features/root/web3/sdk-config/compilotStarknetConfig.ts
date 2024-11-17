import { createConfig, createWeb3AuthAdapter } from "@compilot/react-sdk";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { starknetWalletConfig } from "@/features/root/web3/sdk-wallet/starknetWallet";

import "@/features/root/configureReactDemoEnv";

export const compilotStarknetConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: starknetWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback(
      "multi-chain-support",
    ),
  }),
});

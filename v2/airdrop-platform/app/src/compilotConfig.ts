import { createConfig, createWeb3AuthAdapter } from "@compilot/react-sdk";
import { createWagmiWalletAdapter } from "@compilot/web-sdk-wallet-wagmi";
import { wagmiConfig } from "@/wagmiConfig";
import { env } from "./env.mjs";

import "@/configureDemoEnv";

export const compilotWalletAdapter = createWagmiWalletAdapter(wagmiConfig);
export const compilotConfig = createConfig({
  logLevel: env.NEXT_PUBLIC_LOG_LEVEL,
  authAdapter: createWeb3AuthAdapter({
    wallet: compilotWalletAdapter,
    generateChallenge: async (params) => {
      const challenge = await fetch("/api/generate-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      return challenge.json();
    },
  }),
});

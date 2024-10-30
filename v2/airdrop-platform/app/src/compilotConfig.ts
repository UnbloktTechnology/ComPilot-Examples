import {
  createConfig,
  createWeb3AuthAdapter,
  disconnect,
} from "@compilot/react-sdk";
import { createWagmiWalletAdapter } from "@compilot/web-sdk-wallet-wagmi";
import { wagmiConfig } from "@/wagmiConfig";
import { env } from "./env.mjs";
import { bindCompilotConfigToLocalStorage } from "./sessionStore";

import "@/configureDemoEnv";
import { watchAccount } from "wagmi/actions";

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

void bindCompilotConfigToLocalStorage(compilotConfig);

// sync the account with the compilot session when the change comes from the wallet
watchAccount(wagmiConfig, {
  onChange: () => {
    // only if the route isn't the "account" page
    // where we can link a different wallet so we need to change the account
    // without being disconnected
    if (!window.location.pathname.includes("/account")) {
      void disconnect(compilotConfig);
    }
  },
});

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "../wagmi";
import { createWagmiWalletAdapter } from "@compilot/web-sdk-wallet-wagmi";
import { ComPilotProvider, createWeb3AuthAdapter, createConfig, createAuthAdapter } from "@compilot/react-sdk";
import { generateChallenge, generateChallengeKYB, createSessionKYC, createSessionKYB } from "../compilot-config";
import { useState } from "react";

const walletAdapter = createWagmiWalletAdapter(config);

// Configurations pour le mode wallet
const authAdapterKYC = createWeb3AuthAdapter({
  generateChallenge,
  wallet: walletAdapter,  
});

const authAdapterKYB = createWeb3AuthAdapter({
  generateChallenge: generateChallengeKYB,
  wallet: walletAdapter,
});

// Auth adapters pour le mode sans wallet
const regularAuthAdapterKYC = createAuthAdapter({
  createSession: createSessionKYC
});

const regularAuthAdapterKYB = createAuthAdapter({
  createSession: createSessionKYB
});

// Configurations avec wallet
export const compilotConfigWalletKYC = createConfig({ authAdapter: authAdapterKYC });
export const compilotConfigWalletKYB = createConfig({ authAdapter: authAdapterKYB });

// Configurations sans wallet
export const compilotConfigRegularKYC = createConfig({ authAdapter: regularAuthAdapterKYC });
export const compilotConfigRegularKYB = createConfig({ authAdapter: regularAuthAdapterKYB });

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [activeConfig, setActiveConfig] = useState(compilotConfigRegularKYC);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <ComPilotProvider config={activeConfig}>
            <Component {...pageProps} setActiveConfig={setActiveConfig} />
          </ComPilotProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "../wagmi";
import { createWagmiWalletAdapter } from "@compilot/web-sdk-wallet-wagmi";
import { ComPilotProvider, createWeb3AuthAdapter, createConfig } from "@compilot/react-sdk";
import { generateChallenge } from "../compilot-config";


const walletAdapter = createWagmiWalletAdapter(config);
const authAdapter = createWeb3AuthAdapter({
  generateChallenge,
  wallet: walletAdapter,
});
const compilotConfig = createConfig({ authAdapter });

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <ComPilotProvider config={compilotConfig}>
            <Component {...pageProps} />
          </ComPilotProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;

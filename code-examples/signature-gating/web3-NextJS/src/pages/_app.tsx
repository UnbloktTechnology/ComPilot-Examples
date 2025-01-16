/**
 * @file _app.tsx
 * @description Root application component with Web3 and ComPilot providers
 * 
 * Sets up the application with required providers and authentication:
 * 1. Wagmi for Web3 interactions
 * 2. React Query for data management
 * 3. RainbowKit for wallet connections
 * 4. ComPilot for KYC and smart contract gatingfeatures
 * 
 * @requires @compilot/web-sdk-wallet-wagmi - Wallet adapter for ComPilot
 * @requires @compilot/react-sdk - ComPilot integration with react
 * @requires @rainbow-me/rainbowkit - Wallet connection UI
 */

import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "../wagmi";
import { createWagmiWalletAdapter } from "@compilot/web-sdk-wallet-wagmi";
import { ComPilotProvider, createWeb3AuthAdapter, createConfig } from "@compilot/react-sdk";
import { generateChallenge } from "../compilot-config";

/**
 * Wallet and Auth Configuration
 * Sets up ComPilot authentication with Wagmi wallet adapter
 */
const walletAdapter = createWagmiWalletAdapter(config);
const authAdapter = createWeb3AuthAdapter({
  generateChallenge,
  wallet: walletAdapter,
});

/**
 * ComPilot and Query Configuration
 * Initializes providers with required configuration
 */
const compilotConfig = createConfig({ authAdapter });
const client = new QueryClient();

/**
 * Root Application Component
 * Wraps the application with necessary providers in correct order:
 * 1. WagmiProvider (outermost)
 * 2. QueryClientProvider
 * 3. RainbowKitProvider
 * 4. ComPilotProvider (innermost)
 * 
 * @param {AppProps} props - Next.js app props
 */
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


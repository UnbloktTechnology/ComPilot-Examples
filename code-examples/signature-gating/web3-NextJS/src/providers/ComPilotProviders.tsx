/**
 * @file ComPilotProviders.tsx
 * @description Separate ComPilot providers for KYC and Signature Gating workflows
 * 
 * This file provides context providers that wrap different parts of the application
 * with appropriate ComPilot configurations:
 * - KYCComPilotProvider: For KYC-related functionality
 * - SignatureGatingComPilotProvider: For signature gating functionality
 */

import { ReactNode } from "react";
import { ComPilotProvider, createWeb3AuthAdapter, createConfig } from "@compilot/react-sdk";
import { createWagmiWalletAdapter } from "@compilot/web-sdk-wallet-wagmi";
import { useConfig } from "wagmi";
import { generateChallengeKYC, generateChallengeSignatureGating } from "../compilot-config";

interface ProviderProps {
  children: ReactNode;
}

/**
 * KYCComPilotProvider
 * Provides ComPilot context configured for KYC workflows
 * Uses the KYC-specific challenge generation function
 */
export function KYCComPilotProvider({ children }: ProviderProps) {
  const wagmiConfig = useConfig();
  
  const walletAdapter = createWagmiWalletAdapter(wagmiConfig);
  const authAdapter = createWeb3AuthAdapter({
    generateChallenge: generateChallengeKYC,
    wallet: walletAdapter,
  });
  
  const compilotConfig = createConfig({ authAdapter });
  
  return (
    <ComPilotProvider config={compilotConfig}>
      {children}
    </ComPilotProvider>
  );
}

/**
 * SignatureGatingComPilotProvider
 * Provides ComPilot context configured for Signature Gating workflows
 * Uses the signature gating-specific challenge generation function
 */
export function SignatureGatingComPilotProvider({ children }: ProviderProps) {
  const wagmiConfig = useConfig();
  
  const walletAdapter = createWagmiWalletAdapter(wagmiConfig);
  const authAdapter = createWeb3AuthAdapter({
    generateChallenge: generateChallengeSignatureGating,
    wallet: walletAdapter,
  });
  
  const compilotConfig = createConfig({ authAdapter });
  
  return (
    <ComPilotProvider config={compilotConfig}>
      {children}
    </ComPilotProvider>
  );
}
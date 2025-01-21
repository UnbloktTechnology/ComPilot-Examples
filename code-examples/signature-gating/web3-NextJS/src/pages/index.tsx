/**
 * @file index.tsx
 * @description Main page component implementing gated token minting with KYC verification
 * 
 * This page demonstrates ComPilot's signature gating features with a complete flow:
 * 1. Wallet connection handling (via RainbowKit)
 * 2. KYC status verification
 * 3. Token minting with signature gating
 * 
 * @requires @rainbow-me/rainbowkit - For wallet connection UI
 * @requires @compilot/react-sdk - For authentication and KYC integration
 * @requires wagmi - For wallet state management
 */

import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useOpenWidget } from "@compilot/react-sdk";
import { useAccount } from 'wagmi';
import { useCustomerCheck } from '../hooks/useCustomerCheck';
import { MintButton } from "../components/MintButton";
import { MintButtonSDK } from "../components/MintButtonSDK";
import { useState, useEffect } from 'react';

/**
 * Home Page Component
 * Manages the complete authentication and minting flow
 * 
 * Features:
 * - Wallet connection state management
 * - KYC verification flow
 * - Token minting with gating
 * 
 * Flow:
 * 1. User connects wallet (ConnectButton)
 * 2. If KYC needed, completes verification
 * 3. Access to minting functionality
 * 
 * States:
 * @state {boolean} isConnected - Wallet connection status
 * @state {boolean} isAuthenticated - Wallet signature status
 * @state {string} status - KYC verification status
 * @state {boolean} statusLoading - KYC status loading state
 * @state {string[]} txStatus - Transaction status messages
 */
const Home: NextPage = () => {
  /**
   * Hooks and State Management
   * - useOpenWidget: Controls KYC widget display
   * - useAccount: Manages wallet connection
   * - useCustomerCheck: Handles KYC status verification
   * - txStatus: Tracks transaction progress
   */
  const openWidget = useOpenWidget();
  const { isConnected, address } = useAccount();
  const { checkStatus } = useCustomerCheck();
  const [needsKYC, setNeedsKYC] = useState(true);
  const [txStatus, setTxStatus] = useState<string[]>([]);

  /**
   * Derived States
   * - isLoading: Tracks overall loading state
   */
  const isLoading = openWidget.isPending;

  // Combine les deux effets
  useEffect(() => {
    // Initial check
    if (address) {
      checkStatus().then(status => setNeedsKYC(status !== 'Active'));
    }

    // Widget close handler
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'closeScreen' && address) {
        const status = await checkStatus();
        setNeedsKYC(status !== 'Active');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [address]);

  return (
    <div className={styles.container}>
      <Head>
        <title>ComPilot Signature Gating Example</title>
        <meta content="ComPilot Example" name="description" />
      </Head>

      <main className={styles.main}>
        {/* Wallet Connection Button */}
        <ConnectButton />

        {/* Main Application Flow
            Only shown when wallet is connected and not loading
            Handles both KYC and minting flows */}
        {isConnected && !isLoading && (
          <>
            {needsKYC ? (
              /* KYC Verification Flow
                 Shows KYC widget when verification is needed */
              <button
                id="compilot-button"
                disabled={openWidget.isPending}
                onClick={openWidget.openWidget}
                className={styles.claimButton}
              >
                {openWidget.isPending ? "Processing..." : "Complete KYC"}
              </button>
            ) : (
              <>
                <div className={styles.mintContainer}>
                  <MintButton onStatusUpdate={(status) => setTxStatus(prev => [...prev, status])} />
                  <MintButtonSDK onStatusUpdate={(status) => setTxStatus(prev => [...prev, status])} />
                </div>

                {/* Transaction Status Display
                    Shows real-time updates for ongoing transactions */}
                {txStatus.length > 0 && (
                  <div className={styles.txStatus}>
                    {txStatus.map((status, i) => (
                      <p key={i} className={styles.statusLine}>{status}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;


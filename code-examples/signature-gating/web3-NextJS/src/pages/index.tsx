/**
 * @file index.tsx
 * @description Main page component implementing gated token minting with KYC verification
 * 
 * This page demonstrates ComPilot's signature gating features:
 * 1. Wallet connection handling
 * 2. KYC status verification
 * 3. Dual minting options (API and SDK)
 * 4. Real-time transaction status updates
 * 
 * @requires @rainbow-me/rainbowkit - For wallet connection UI
 * @requires @compilot/react-sdk - For KYC widget integration
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
import { useState } from 'react';

/**
 * Home Page Component
 * Manages the main application flow and UI states
 * 
 * Features:
 * - Wallet connection state management
 * - KYC verification flow
 * - Token minting options (API/SDK)
 * - Transaction status tracking
 * 
 * States:
 * @state {boolean} isConnected - Wallet connection status
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
  const { isConnected } = useAccount();
  const { status, loading: statusLoading } = useCustomerCheck();
  const [txStatus, setTxStatus] = useState<string[]>([]);

  /**
   * Derived States
   * - needsKYC: Determines if KYC verification is required
   * - isLoading: Tracks overall loading state
   */
  const needsKYC = status !== 'Active';
  const isLoading = statusLoading;

  return (
    <div className={styles.container}>
      <Head>
        <title>ComPilot Next.Js Web3</title>
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
                onClick={() => openWidget.openWidget()}
                className={styles.claimButton}
              >
                Complete KYC
              </button>
            ) : (
              /* Minting Options
                 Shows both API and SDK minting buttons
                 Displays transaction status updates */
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


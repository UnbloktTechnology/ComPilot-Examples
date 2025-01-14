/**
 * @file MintButtonSDK.tsx
 * @description Implementation of token minting using ComPilot's SDK integration
 * 
 * This component provides an alternative minting flow using the ComPilot SDK:
 * 1. Uses SDK hooks for signature requests
 * 2. Handles transaction preparation and execution
 * 3. Provides real-time status updates
 * 4. Monitors transaction confirmation
 * 
 * @requires @compilot/react-sdk - ComPilot's React SDK for direct integration
 * @requires viem - For Ethereum data encoding and utilities
 * @requires wagmi - For wallet and chain interactions
 * @requires @tanstack/react-query - For mutation management
 */

import { useGetTxAuthDataSignature } from "@compilot/react-sdk";
import { encodeFunctionData, parseEther } from "viem";
import { usePublicClient, useWalletClient, useAccount, useChainId } from "wagmi";
import { EvmChainId } from "@compilot/react-sdk";
import { useMutation } from "@tanstack/react-query";
import { GatedTokenABI } from "../abis/GatedTokenABI";
import styles from "../styles/Home.module.css";

/**
 * Contract address is expected to be a valid Ethereum address
 * Configured through environment variable NEXT_PUBLIC_GATED_TOKEN_ADDRESS
 */
const GATED_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_GATED_TOKEN_ADDRESS as `0x${string}`;

/**
 * Props for status updates
 * @param onStatusUpdate - Callback function to handle status messages
 */
interface MintButtonSDKProps {
  onStatusUpdate: (status: string) => void;
}

/**
 * MintButtonSDK Component
 * Handles the complete minting flow using ComPilot SDK integration
 * 
 * @component
 * @param {MintButtonSDKProps} props - Component props
 * 
 * Flow:
 * 1. User clicks mint button
 * 2. Component prepares transaction data with 0.01 MATIC
 * 3. Requests signature through SDK hook
 * 4. Executes transaction with signature
 * 5. Monitors transaction status
 * 
 * Error Handling:
 * - Wallet connection errors
 * - SDK authorization failures
 * - Transaction execution errors
 * - Network issues
 */
export function MintButtonSDK({ onStatusUpdate }: MintButtonSDKProps) {
  /**
   * SDK and Wallet Hooks
   * - getTxAuthDataSignature: SDK hook for signature requests
   * - walletClient: For transaction execution
   * - publicClient: For transaction monitoring
   */
  const { address } = useAccount() as { address: `0x${string}` };
  const { getTxAuthDataSignature } = useGetTxAuthDataSignature();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  /**
   * Mutation hook handling the minting process through SDK
   * Uses react-query for state management and error handling
   */
  const mutation = useMutation({
    mutationFn: async () => {
      onStatusUpdate("🚀 Starting SDK mint process...");
      onStatusUpdate(`📝 Contract: ${GATED_TOKEN_ADDRESS}`);
      
      if (!address || !walletClient) {
        onStatusUpdate("❌ Missing wallet connection");
        return;
      }

      /**
       * Transaction input preparation
       * @param amount - 0.01 MATIC in Wei
       * @param contractAbi - Contract ABI from GatedTokenABI
       * @param args - Transaction arguments [recipient, amount]
       */
      const amount = parseEther("0.01");

      try {
        /**
         * SDK Signature Request
         * Prepares input for SDK signature request with required parameters
         */
        const txAuthInput = {
          namespace: "eip155" as const,
          userAddress: address,
          contractAbi: Array.from(GatedTokenABI),
          contractAddress: GATED_TOKEN_ADDRESS as `0x${string}`,
          functionName: "mint",
          args: [address, amount.toString()],
          chainId: EvmChainId.parse("80002"),
          workflowId: process.env.NEXT_PUBLIC_WORKFLOW_GATING_ID!,
        };

        /**
         * SDK Authorization
         * Gets signature using ComPilot SDK hook
         * @returns {Promise<SignatureResponse>} - SDK response with signature
         */
        onStatusUpdate("📝 Requesting signature via SDK...");
        const signatureResponse = await getTxAuthDataSignature(txAuthInput);
        onStatusUpdate("✅ Got signature from SDK");

        if (!signatureResponse.isAuthorized) {
          throw new Error("Not authorized");
        }

        /**
         * Transaction Execution
         * Creates and sends the signed transaction
         * @param txData - Combined unsigned transaction and signature
         */
        onStatusUpdate("🔏 Creating transaction data...");
        const unsignedTx = encodeFunctionData({
          abi: GatedTokenABI,
          functionName: "mint",
          args: [address, amount],
        });

        const txData = (unsignedTx + signatureResponse.payload) as `0x${string}`;

        /**
         * Transaction Monitoring
         * Sends transaction and waits for confirmation
         * @returns {TransactionReceipt} - Transaction receipt with status
         */
        onStatusUpdate("💫 Sending to wallet...");
        const tx = await walletClient.sendTransaction({
          to: GATED_TOKEN_ADDRESS,
          data: txData,
        });
        onStatusUpdate(`✨ Transaction sent: ${tx.slice(0, 10)}...`);

        onStatusUpdate("⏳ Waiting for confirmation...");
        const receipt = await publicClient?.waitForTransactionReceipt({ hash: tx });
        
        if (receipt?.status === 'success') {
          onStatusUpdate("✅ Transaction successful!");
        } else {
          onStatusUpdate("❌ Transaction failed!");
        }

        return receipt;
      } catch (error) {
        onStatusUpdate(`🚨 Error: ${(error as Error).message}`);
        throw error;
      }
    }
  });

  /**
   * Component Render
   * Displays mint button with loading state
   * Uses SDK-specific text to differentiate from API version
   * @returns {JSX.Element} - Button element
   */
  return (
    <button 
      onClick={() => mutation.mutate()}
      className={styles.claimButton}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Minting (SDK)..." : "Mint with SDK"}
    </button>
  );
} 
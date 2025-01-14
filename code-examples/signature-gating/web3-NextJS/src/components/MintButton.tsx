/**
 * @file MintButton.tsx
 * @description Implementation of a token minting component using ComPilot's API-based signature gating
 * 
 * This component handles the complete minting flow with signature verification:
 * 1. Prepares transaction data with amount
 * 2. Requests authorization signature from ComPilot API
 * 3. Executes the signed transaction
 * 4. Monitors transaction status
 * 
 * @requires viem - For Ethereum data encoding and utilities
 * @requires wagmi - For wallet and chain interactions
 * @requires @tanstack/react-query - For mutation management
 */

import { encodeFunctionData, parseEther } from "viem";
import { useWalletClient, useAccount, useChainId, usePublicClient } from "wagmi";
import styles from "../styles/Home.module.css";
import { useMutation } from "@tanstack/react-query";
import { GatedTokenABI } from "../abis/GatedTokenABI";

/**
 * Contract address is expected to be a valid Ethereum address
 * Configured through environment variable NEXT_PUBLIC_GATED_TOKEN_ADDRESS
 */
const GATED_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_GATED_TOKEN_ADDRESS as `0x${string}`;

/**
 * Props for status updates
 * @param onStatusUpdate - Callback function to handle status messages
 */
interface MintButtonProps {
  onStatusUpdate: (status: string) => void;
}

/**
 * MintButton Component
 * Handles the complete minting flow with ComPilot API integration
 * 
 * @component
 * @param {MintButtonProps} props - Component props
 * 
 * Flow:
 * 1. User clicks mint button
 * 2. Component prepares transaction data with 0.01 MATIC
 * 3. Requests signature from ComPilot API
 * 4. Executes transaction with signature
 * 5. Monitors transaction status
 * 
 * Error Handling:
 * - Wallet connection errors
 * - API authorization failures
 * - Transaction execution errors
 * - Network issues
 */
export function MintButton({ onStatusUpdate }: MintButtonProps) {
  // Wallet and chain interaction hooks
  const { address } = useAccount() as { address: `0x${string}` };
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  /**
   * Mutation hook handling the minting process
   * Uses react-query for state management and error handling
   */
  const mutation = useMutation({
    mutationFn: async () => {
      onStatusUpdate("🚀 Starting mint process...");
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
      
      const input = {
        contractAbi: Array.from(GatedTokenABI),
        contractAddress: GATED_TOKEN_ADDRESS,
        functionName: "mint",
        args: [address, amount.toString()],
        userAddress: address,
        chainId: chainId.toString(),
        workflowId: process.env.NEXT_PUBLIC_WORKFLOW_GATING_ID!,
        namespace: "eip155" as const,
      };

      try {
        /**
         * API Signature Request
         * Sends request to ComPilot API endpoint for transaction authorization
         * @returns {Promise<SignatureResponse>} - API response with signature
         */
        onStatusUpdate("📝 Requesting signature...");
        const signatureResponse = await fetch("/api/tx-auth-signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        onStatusUpdate("✅ Got signature from API");

        const result = await signatureResponse.json();

        if (!result.isAuthorized) {
          throw new Error(result.errorMessage?.shortMessage || "Not authorized");
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

        const txData = (unsignedTx + result.payload) as `0x${string}`;

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
   * @returns {JSX.Element} - Button element
   */
  return (
    <button 
      onClick={() => mutation.mutate()}
      className={styles.claimButton}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Minting with API..." : "Mint Token"}
    </button>
  );
} 
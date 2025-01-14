/**
 * @file useCustomerCheck.ts
 * @description Custom hook for verifying customer KYC status through ComPilot's API
 * 
 * This hook manages customer verification status:
 * 1. Checks if wallet is connected
 * 2. Fetches customer status from ComPilot API
 * 3. Manages loading and error states
 * 4. Updates status when wallet changes
 * 
 * @requires react - For state and effect hooks
 * @requires wagmi - For wallet state management
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

/**
 * useCustomerCheck Hook
 * Custom hook for managing customer KYC verification status
 * 
 * @returns {Object} Hook return object
 * @property {string | null} status - Current customer status ('Active', 'Pending', etc.)
 * @property {boolean} loading - Loading state indicator
 * 
 * Usage:
 * const { status, loading } = useCustomerCheck();
 * if (status === 'Active') { // Customer is verified }
 */
export function useCustomerCheck() {
  /**
   * Wallet Hook
   * Gets current connected wallet address
   */
  const { address } = useAccount();

  /**
   * Local State
   * Manages customer status and loading state
   */
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Status Check Effect
   * Fetches customer status when wallet address changes
   * Handles API calls and error states
   */
  useEffect(() => {
    async function checkStatus() {
      if (!address) return;
      
      setLoading(true);
      try {
        /**
         * API Request
         * Fetches customer status from ComPilot API
         * Updates local state based on response
         */
        const response = await fetch(`/api/customer?address=${address}`);
        const data = await response.json();
        
        if (response.ok) {
          console.log('Customer data:', data);
          setStatus(data.status);
        } else {
          setStatus(null);
        }
      } catch (error) {
        console.error('Error checking customer:', error);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [address]);

  return { status, loading };
} 
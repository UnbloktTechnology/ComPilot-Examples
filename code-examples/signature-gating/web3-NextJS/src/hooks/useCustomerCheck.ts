/**
 * @file useCustomerCheck.ts
 * @description Custom hook for verifying customer KYC status through ComPilot's API
 * 
 * Simple hook that:
 * 1. Provides a function to check KYC status from API
 * 2. Maintains internal status state
 * 3. Auto-checks when wallet address changes
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
export const useCustomerCheck = () => {
  /**
   * Wallet Hook
   * Gets current connected wallet address
   */
  const { address } = useAccount();

  /**
   * Local State
   * Manages customer status
   */
  const [status, setStatus] = useState<string | null>(null);

  /**
   * Status Check Effect
   * Fetches customer status when wallet address changes
   * Handles API calls and error states
   */
  async function checkStatus() {
    if (!address) {
      console.warn('No address available despite being connected!');
      return null;
    }
    

    try {
      const response = await fetch(`/api/customer?address=${address}`);
      const data = await response.json();
      
      if (response.ok) {
        const newStatus = data.status;
        setStatus(newStatus);
        return newStatus;
      }
    } catch (error) {
      console.error('Error in checkStatus:', error);
    } finally {
    }
    console.log('Returning current status:', status);
    return status;
  }

  useEffect(() => {
    console.log('Address changed, checking status...');
    checkStatus();
  }, [address]);

  return { checkStatus };
}; 
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export function useCustomerCheck() {
  const { address } = useAccount();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      if (!address) return;
      
      setLoading(true);
      try {
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
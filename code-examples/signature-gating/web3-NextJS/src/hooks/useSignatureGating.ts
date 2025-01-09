import { useState } from 'react';
import { useAccount } from 'wagmi';

interface SignatureResponse {
  isAuthorized: boolean;
  payload?: string;
  error?: string;
}

export function useSignatureGating() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestSignature = async () => {
    if (!address) return null;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gating-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          functionName: "claimToken",
          args: [address],
          chainId: 1,
        }),
      });

      const data: SignatureResponse = await response.json();
      console.log('Gating signature response:', data);

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get signature';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { requestSignature, loading, error };
} 
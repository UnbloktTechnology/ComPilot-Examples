import { useState } from 'react';
import { TransactionLog } from '@/types/devmode';

type ApiLog = Pick<TransactionLog, 'apiRequest' | 'apiResponse' | 'id'>;

/**
 * Hook to handle API calls for transaction submission
 * Manages the API request/response lifecycle and logging
 * @returns Object containing makeApiCall function and API logs
 */
export const useTransactionApi = () => {
  // Store API request/response details for logging
  const [apiLog, setApiLog] = useState<ApiLog>({});

  /**
   * Makes an API call to submit a transaction
   * @param transaction - Stringified transaction data
   * @returns Promise with the API response
   */
  const makeApiCall = async (transaction: string) => {
    // Prepare API request details for logging
    const apiRequest = {
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.parse(transaction)
    };

    // Log the request
    setApiLog({ apiRequest });

    // Make the API call
    const response = await fetch(apiRequest.url, {
      method: apiRequest.method,
      headers: apiRequest.headers,
      body: JSON.stringify(apiRequest.body)
    });

    const data = await response.json();
    
    // Log the response
    setApiLog(prev => ({
      ...prev,
      id: data.id,
      apiResponse: {
        status: response.status,
        body: data
      }
    }));

    if (!response.ok) {
      throw new Error(data.error || 'Transaction failed');
    }

    return data;
  };

  return { makeApiCall, apiLog };
}; 
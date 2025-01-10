import { Transaction } from '../types/transaction';

/**
 * Service for interacting with the ComPilot API.
 * Handles transaction submissions and API communication.
 * 
 * Required environment variables:
 * - COMPILOT_API_URL: Base URL for the ComPilot API
 * - COMPILOT_API_KEY: API key for authentication
 */
export class ComPilotService {
    /**
     * Submits a transaction to the ComPilot API for processing.
     * 
     * @param transaction - The transaction details to submit
     * @throws Error if API credentials are missing or if the API request fails
     * @returns The API response data
     * 
     * Example usage:
     * ```typescript
     * const transaction = {
     *   transactionType: 'crypto',
     *   transactionSubType: 'wallet transfer',
     *   transactionInfo: {
     *     direction: 'IN',
     *     amount: 0.5,
     *     currencyCode: 'ETH'
     *   }
     * };
     * const response = await ComPilotService.submitTransaction(transaction);
     * ```
     */
    static async submitTransaction(transaction: Transaction) {
        console.log('📝 Environment variables:', {
            apiUrl: process.env.COMPILOT_API_URL,
            hasApiKey: !!process.env.COMPILOT_API_KEY
        });

        if (!process.env.COMPILOT_API_URL) {
            throw new Error('COMPILOT_API_URL is not defined');
        }

        const response = await fetch(`${process.env.COMPILOT_API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.COMPILOT_API_KEY}`
            },
            body: JSON.stringify(transaction)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`ComPilot API Error: ${JSON.stringify(data, null, 2)}`);
        }

        return data;
    }
} 
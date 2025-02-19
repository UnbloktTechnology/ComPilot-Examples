import { Customer, CustomerResponse } from '../types/customer';

/**
 * Service for interacting with the ComPilot API.
 * Handles transaction submissions and API communication.
 * 
 * Required environment variables:
 * - COMPILOT_API_URL: Base URL for the ComPilot API
 * - COMPILOT_API_KEY: API key for authentication
 * - COMPILOT_TMS_WORKFLOW_ID: Workflow ID for transaction monitoring
 */
export class ComPilotService {
    /**
     * Submits a customer screening request to the ComPilot API.
     * 
     * @param customer - The customer details to submit for screening
     * @throws Error if API credentials are missing or if the API request fails
     * @returns The API response data
     */
    static async submitCustomerScreening(customer: Customer): Promise<CustomerResponse> {
        console.log('📝 Environment variables:', {
            apiUrl: process.env.COMPILOT_API_URL,
            hasApiKey: !!process.env.COMPILOT_API_KEY,
            workflowId: process.env.COMPILOT_SCREENING_WORKFLOW_ID,
            apiKeyLength: process.env.COMPILOT_API_KEY?.length
        });

        console.log('🔑 API Key first 10 chars:', process.env.COMPILOT_API_KEY?.substring(0, 10));

        if (!process.env.COMPILOT_API_URL) {
            throw new Error('COMPILOT_API_URL is not defined');
        }

        if (!process.env.COMPILOT_SCREENING_WORKFLOW_ID) {
            throw new Error('COMPILOT_SCREENING_WORKFLOW_ID is not defined');
        }

        const url = `${process.env.COMPILOT_API_URL}/workflows/${process.env.COMPILOT_SCREENING_WORKFLOW_ID}/customers`;
        console.log('�� Request URL:', url);

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.COMPILOT_API_KEY}`
        };
        console.log('📋 Request headers:', {
            ...headers,
            'Authorization': headers.Authorization.substring(0, 20) + '...'
        });

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(customer)
        });

        const data = await response.json();
        console.log('📥 Response status:', response.status);
        console.log('📦 Response data:', data);

        if (!response.ok) {
            throw new Error(`ComPilot API Error: ${JSON.stringify(data, null, 2)}`);
        }

        return data as CustomerResponse;
    }
} 
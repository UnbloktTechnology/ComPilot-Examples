/**
 * @file customer.ts
 * @description API route handler for customer status verification
 * 
 * This endpoint proxies requests to ComPilot's API to check customer KYC status:
 * 1. Receives wallet address as query parameter
 * 2. Makes authenticated request to ComPilot API
 * 3. Returns customer status or error response
 * 
 * @requires next - For API route handling
 * @requires process.env.API_KEY - ComPilot API key for authentication
 * @requires process.env.COMPILOT_PROJECT_ID - Project identifier
 */

import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * API Route Handler
 * Manages customer status verification requests
 * 
 * @param req - Contains address query parameter
 * @param res - Used to send API response
 * 
 * Endpoint: GET /api/customer?address={wallet_address}
 * Response: { status: string } | { error: string }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  try {
    /**
     * ComPilot API Request
     * Fetches customer status for the given wallet address
     * Uses project-specific endpoint with API key authentication
     */
    const response = await fetch(
      `https://api.compilot.ai/projects/${process.env.COMPILOT_PROJECT_ID}/customer-wallets/${address}/customer`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
        }
      }
    );
    
    // Handle 404 specifically for unknown customers
    if (response.status === 404) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
} 
/**
 * @file tx-auth-signature.ts
 * @description API route handler for transaction authorization signatures
 * 
 * This endpoint manages signature requests for gated transactions:
 * 1. Receives transaction details in request body
 * 2. Forwards request to ComPilot's signature endpoint
 * 3. Returns signature or error response
 * 
 * @requires next - For API route handling
 * @requires process.env.API_KEY - ComPilot API key for authentication
 */

import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API Route Handler
 * Manages transaction signature requests
 * 
 * @param req - Contains transaction details in body
 * @param res - Used to send API response
 * 
 * Endpoint: POST /api/tx-auth-signature
 * Request Body: {
 *   contractAbi: Array,
 *   contractAddress: string,
 *   functionName: string,
 *   args: Array,
 *   userAddress: string,
 *   chainId: string,
 *   workflowId: string
 * }
 * Response: { payload: string, isAuthorized: boolean } | { error: string }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    /**
     * ComPilot Signature Request
     * Forwards transaction details to ComPilot's signature endpoint
     * Includes API key for authentication
     */
    const signatureResponse = await fetch(
      "https://api.compilot.ai/customer-tx-auth-signature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await signatureResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching signature:", error);
    res.status(500).json({ error: "Failed to get signature" });
  }
} 
/**
 * @file challenge.ts
 * @description API route handler for challenge-based authentication using ComPilot SDK
 * 
 * This endpoint manages challenge requests for wallet verification:
 * 1. Creates a challenge message using ComPilot SDK
 * 2. Uses workflow-based authentication
 * 3. Returns challenge for wallet signature
 * 
 * Used in the KYC flow to verify wallet ownership before starting KYC process
 * 
 * @requires @compilot/js-sdk - ComPilot's server-side SDK
 * @requires process.env.API_KEY - ComPilot API key for authentication
 * @requires process.env.WEBHOOK_SECRET - Secret for webhook verification - optional if webhook is not used
 * @requires process.env.WORKFLOW_KYC_ID - KYC workflow identifier
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { createSdk } from "@compilot/js-sdk";

/**
 * SDK Client Initialization
 * Creates ComPilot SDK instance with required credentials
 */
const apiClient = createSdk({
  webhookSecret: process.env.WEBHOOK_SECRET!,
  apiKey: process.env.API_KEY!,
});

/**
 * API Route Handler
 * Manages challenge message requests using ComPilot SDK
 * 
 * @param req - Contains wallet details and workflow parameters
 * @param res - Used to send API response
 * 
 * Endpoint: POST /api/challenge
 * Request Body: { address: string, ... } + additional workflow parameters
 * Response: { message: string, sessionId: string } | { error: string }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    /**
     * Challenge Creation
     * Uses SDK to create a challenge for wallet verification
     * Includes workflow ID for KYC process
     */
    const sessionRes = await apiClient.createWeb3Challenge({
      workflowId: process.env.WORKFLOW_KYC_ID,
      ...req.body,
    });
    res.status(200).json(sessionRes);

  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
}

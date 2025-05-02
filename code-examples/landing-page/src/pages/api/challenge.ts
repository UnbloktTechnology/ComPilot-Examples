import type { NextApiRequest, NextApiResponse } from "next";
import { createSdk } from "@compilot/js-sdk";


const apiClient = createSdk({
  apiKey: process.env.API_KEY!,
});

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
    const { type, ...restBody } = req.body;
    console.log('Received request with type:', type);
    console.log('Request body:', req.body);

    let workflowId: string;

    if (type === 'KYC') {
      workflowId = process.env.KYC_WORKFLOW_ID!;
      console.log('Using KYC workflow:', workflowId);
    } else if (type === 'KYB') {
      workflowId = process.env.KYB_WORKFLOW_ID!;
      console.log('Using KYB workflow:', workflowId);
    } else {
      console.error('Invalid type received:', type);
      return res.status(400).json({ error: "Type must be 'KYC' or 'KYB'" });
    }

    if (!workflowId) {
      console.error(`${type}_WORKFLOW_ID is not defined in environment variables`);
      return res.status(500).json({ error: `${type}_WORKFLOW_ID is not configured` });
    }

    console.log('Creating web3 challenge with params:', {
      workflowId,
      ...restBody
    });

    const sessionRes = await apiClient.createWeb3Challenge({
      workflowId,
      ...restBody,
    });

    console.log('Challenge created successfully:', sessionRes);
    res.status(200).json(sessionRes);

  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({
      error: "Failed to fetch access token",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
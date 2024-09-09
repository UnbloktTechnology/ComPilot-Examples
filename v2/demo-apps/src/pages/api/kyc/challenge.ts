import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { createNexeraSdk } from "@nexeraid/js-sdk";

import "@/features/root/configureNodeDemoEnv";

const apiClient = createNexeraSdk({
  webhookSecret: env.NEXERA_ID_WEBHOOK_SECRET_KYC,
  apiKey: env.NEXERA_ID_API_KEY_KYC,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Get the challenge parameters from the request body
    const params = req.body;

    const challengeRes = await apiClient.createWeb3Challenge({
      workflowId: env.NEXERA_ID_WORKFLOW_ID_KYC,
      ...params,
    });

    res.status(200).json(challengeRes);
  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
}

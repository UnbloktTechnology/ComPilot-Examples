import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { createSdk } from "@compilot/js-sdk";

import "@/features/root/configureNodeDemoEnv";

const apiClient = createSdk({
  webhookSecret: env.COMPILOT_WEBHOOK_SECRET_DEFI_RULE_ENGINE,
  apiKey: env.COMPILOT_API_KEY_DEFI_RULE_ENGINE,
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
      workflowId: env.COMPILOT_WORKFLOW_ID_DEFI_RULE_ENGINE,
      ...params,
    });

    res.status(200).json(challengeRes);
  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
}

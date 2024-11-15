import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { createSdk } from "@compilot/js-sdk";

import "@/features/root/configureNodeDemoEnv";

const apiClient = createSdk({
  webhookSecret: env.COMPILOT_WEBHOOK_SECRET_BANK,
  apiKey: env.COMPILOT_API_KEY_BANK,
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
    // Get the current user ID
    // NOTE: This is a simplified example. In a real-world application, you should use a more secure method to get the user ID.
    const userId = req.body.userId;

    const authSession = await apiClient.createSession({
      externalCustomerId: userId,
      workflowId: env.COMPILOT_WORKFLOW_ID_BANK,
    });

    res.status(200).json(authSession);
  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { createNexeraSdk } from "@nexeraid/js-sdk";

const apiClient = createNexeraSdk({
  webhookSecret: process.env.WEBHOOK_SECRET!,
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
    const sessionRes = await apiClient.createWeb3Challenge({
      workflowId: process.env.WORKFLOW_ID,
      ...req.body,
    });
    res.status(200).json(sessionRes);

  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
}

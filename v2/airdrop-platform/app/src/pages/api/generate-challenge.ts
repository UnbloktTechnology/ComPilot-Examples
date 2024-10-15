import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { createSdk, GenerateWalletChallengeRequest } from "@compilot/js-sdk";

import "@/configureDemoEnv";

const compilotSdk = createSdk({
  apiKey: env.COMPILOT_API_KEY_KYC_AIRDROP,
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
    const params = GenerateWalletChallengeRequest.omit({
      workflowId: true,
    }).parse(req.body);

    // attach the workflowId we want to the request
    const challengeRes = await compilotSdk.createWeb3Challenge({
      address: params.address,
      blockchainId: params.blockchainId,
      namespace: params.namespace,
      origin: params.origin,
      workflowId: env.COMPILOT_WORKFLOW_ID_KYC_AIRDROP,
    });

    console.log("challengeRes", challengeRes);

    res.status(200).json(challengeRes);
  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
}

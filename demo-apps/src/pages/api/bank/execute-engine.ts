import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { BlockchainAddress } from "@nexeraid/identity-schemas";
import { getScenarioWebhookBankRedisKey } from "./scenario-webhook";
import { redis } from "@/server/redis";
import type { ScenarioWebhookPayload } from "@/utils/scenariosWebhook";

const inputSchema = z.object({
  address: BlockchainAddress,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      // Validate input
      const input = inputSchema.parse(req.body);

      const redisKey = getScenarioWebhookBankRedisKey(input.address);
      const redisData = await redis.get<ScenarioWebhookPayload>(redisKey);

      console.log("REDIS DATA BANK: ", JSON.stringify(redisData));
      if (redisData?.result) {
        await redis.del(redisKey);

        return {
          data: redisData.result,
          isValid: redisData.result === "valid",
        };
      }
      if (redisData?.result) {
        await redis.del(redisKey);
        res.status(200).json({
          data: redisData.result,
          isValid: redisData.result === "valid",
        });
        return {
          data: redisData.result,
          isValid: redisData.result === "valid",
        };
      }

      res.status(200).json({
        data: "unknown",
        isValid: false,
      });
      return {
        data: "unknown",
        isValid: false,
      };
    } catch (error) {
      console.error("API call error:", error);
      res.status(500).json({ error: "Failed to fetch access token" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

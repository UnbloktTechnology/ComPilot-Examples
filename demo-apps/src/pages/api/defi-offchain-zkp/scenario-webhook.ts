import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { redis } from "@/server/redis";
import type { ScenarioWebhookPayload } from "@/utils/scenariosWebhook";

export const getScenarioWebhookDefiOffchainZKPRedisKey = (address: string) => {
  return (
    `${env.NEXT_PUBLIC_ENVIRONMENT}_DEFI_OFFCHAIN_ZKP_EXAMPLE_SCENARIO_WEBHOOK_` +
    address.toLowerCase()
  );
};

const scenarioWebHookPost = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === "POST") {
    console.log("=== scenarioWebHookPost DEFI OFFCHAIN req.body ===", req.body);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body: ScenarioWebhookPayload = req.body;
    if (!((body.result as unknown) instanceof Array)) {
      const key = getScenarioWebhookDefiOffchainZKPRedisKey(body.address);
      await redis.set(key, JSON.stringify(body));
    }
    res.status(200).json({ response: "ok" });
  }
  if (req.method === "GET") {
    res.status(200).json({ response: "ok" });
  }
};

export default scenarioWebHookPost;

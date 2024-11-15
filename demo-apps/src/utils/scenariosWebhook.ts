import { RuleResultStatus } from "@nexeraid/identity-schemas";
import { GenericVerifiableCredentialSchema } from "@nexeraid/identity-schemas/verifiable-credentials";
import { z } from "zod";

const ScenarioWebhookPayloadSchema = z.object({
  customerId: z.string(),
  address: z.string(),
  result: RuleResultStatus,
  executionId: z.string(),
  scenarios: z
    .object({
      scenarioId: z.string(),
      result: z
        .object({
          objectId: z.string(),
          result: z.object({
            is_valid: z.boolean(),
            reasons: z.array(z.unknown()),
          }),
        })
        .array(),
    })
    .array(),
  data: GenericVerifiableCredentialSchema.array(),
});
export type ScenarioWebhookPayload = z.infer<
  typeof ScenarioWebhookPayloadSchema
>;

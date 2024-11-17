import { type GenerateWeb3ChallengeParams } from "@compilot/react-sdk";

export const createDemoAppGenerateChallengeCallback =
  (
    demoApp:
      | "multi-chain-support"
      | "bank"
      | "bank-kyb"
      | "bank-web3"
      | "defi-offchain-zkp"
      | "defi-rule-engine"
      | "kyc",
  ) =>
  async (params: GenerateWeb3ChallengeParams) => {
    const challenge = await fetch(`/api/${demoApp}/challenge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    return challenge.json();
  };

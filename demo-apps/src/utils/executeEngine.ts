import type {
  BlockchainAddress,
  BlockchainNamespace,
} from "@nexeraid/identity-schemas";

// Define the input and response types
interface ExecuteEngineRequest {
  address: BlockchainAddress;
  blockchainNamespace: BlockchainNamespace;
}

interface ExecuteEngineResponse {
  data: "valid" | "error" | "unknown" | "not-valid";
  isValid: boolean;
}

type ExampleType =
  | "bank"
  | "bank-web3"
  | "bank-kyb"
  | "defi-offchain-zkp"
  | "defi-rule-engine";
//   | "kyc"
//   | "sygnum-web3";

export async function executeEngine(
  requestData: ExecuteEngineRequest,
  exampleType: ExampleType,
): Promise<ExecuteEngineResponse> {
  try {
    const response = await fetch(`/api/${exampleType}/execute-engine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = (await response.json()) as ExecuteEngineResponse;
    return data;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Error fetching access token");
  }
}

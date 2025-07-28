import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { API_BASES } from "../apiBases";
import { NEXERA_EVM_CHAINS } from "@nexeraid/identity-schemas";

// Load environment variables from .env file at project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PRODUCTION_TYPE = process.env.PRODUCTION_TYPE || "prod";
const API_BASE = API_BASES[PRODUCTION_TYPE] || API_BASES["prod"];
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set in environment variables.");
  process.exit(1);
}

// Configuration - Update these values as needed
const WORKFLOW_ID = process.env.WORKFLOW_ID || "your-workflow-id-here";
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0x1234567890123456789012345678901234567890";
const CHAIN_ID = process.env.CHAIN_ID || "1"; // Ethereum mainnet

// Custom contract data for blockchain-api
const createContractData = {
  blockchainNamespace: "eip155",
  contractAddress: CONTRACT_ADDRESS,
  contractName: "Original Contract",
  chainIds: [NEXERA_EVM_CHAINS.ETHEREUM],
};

// Custom scenario data for scenarios-api
const createScenarioData = {
  name: "Test Scenario",
  description: "A test scenario for API testing",
  type: "BlockchainPolicies" as const,
  entityType: "individual" as const,
};

async function addCustomContract(workflowId: string) {
  if (!API_KEY) {
    console.error("API_KEY is not set in environment variables.");
    process.exit(1);
  }
  const url = `${API_BASE}/blockchain-api/allowed-contracts/${workflowId}/`;

  console.log(`Adding custom contract to workflow ${workflowId}...`);
  console.log(`URL: ${url}`);
  console.log(`Contract data:`, createContractData);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(createContractData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Custom contract added successfully:");
    console.log(JSON.stringify(data, null, 2));

    // Update the allowed contract's chain IDs
    if (data.allowedContractId) {
      await updateAllowedContractChainIds(data.allowedContractId);
    }

    return data;
  } catch (error) {
    console.error("❌ Error adding custom contract:", error);
    throw error;
  }
}

async function updateAllowedContractChainIds(allowedContractId: string) {
  if (!API_KEY) {
    console.error("API_KEY is not set in environment variables.");
    process.exit(1);
  }

  const updateData = {
    chainIds: [
      NEXERA_EVM_CHAINS.ETHEREUM,
      NEXERA_EVM_CHAINS.ARBITRUM,
      NEXERA_EVM_CHAINS.POLYGON,
    ],
  };

  const url = `${API_BASE}/blockchain-api/allowed-contracts/${allowedContractId}/contract-chain-ids/batch`;

  console.log(
    `\nUpdating allowed contract chain IDs for ${allowedContractId}...`
  );
  console.log(`URL: ${url}`);
  console.log(`Update data:`, updateData);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Allowed contract chain IDs updated successfully:");
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("❌ Error updating allowed contract chain IDs:", error);
    throw error;
  }
}

async function addCustomScenario(workflowId: string) {
  if (!API_KEY) {
    console.error("API_KEY is not set in environment variables.");
    process.exit(1);
  }
  const url = `${API_BASE}/rules-engine/scenarios/`;

  console.log(`\nAdding custom scenario to workflow ${workflowId}...`);
  console.log(`URL: ${url}`);
  console.log(`Scenario data:`, createScenarioData);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(createScenarioData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // TODO: associate the scenario to the workflow
    // The endpoint needs to be added to the public scenarios-api

    const data = await response.json();
    console.log("✅ Custom scenario added successfully:");
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("❌ Error adding custom scenario:", error);
    throw error;
  }
}

async function getWorkflowDetails(workflowId: string) {
  if (!API_KEY) {
    console.error("API_KEY is not set in environment variables.");
    process.exit(1);
  }
  const url = `${API_BASE}/workflows-engine/sig-gating/${workflowId}`;

  console.log(`\nFetching current workflow details...`);
  console.log(`URL: ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("📋 Current workflow details:");
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("❌ Error fetching workflow details:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log(`🚀 Updating Signature Gating Workflow`);
    console.log(`Using API base: ${API_BASE}`);
    console.log(`Workflow ID: ${WORKFLOW_ID}`);
    console.log(`Contract Address: ${CONTRACT_ADDRESS}`);
    console.log(`Chain ID: ${CHAIN_ID}`);
    console.log("=".repeat(60));

    // First, get current workflow details
    await getWorkflowDetails(WORKFLOW_ID);

    // Add custom contract
    await addCustomContract(WORKFLOW_ID);

    // Add custom scenario
    await addCustomScenario(WORKFLOW_ID);

    // Get updated workflow details
    console.log("\n" + "=".repeat(60));
    await getWorkflowDetails(WORKFLOW_ID);

    console.log("\n🎉 Workflow update completed successfully!");
    console.log("\n📝 Summary:");
    console.log(
      `- Added custom contract: ${CONTRACT_ADDRESS} on chain ${CHAIN_ID}`
    );
    console.log(`- Added custom scenario: ${createScenarioData.name}`);
    console.log(`- Workflow ID: ${WORKFLOW_ID}`);
  } catch (error) {
    console.error("\n💥 Workflow update failed:", error);
    process.exit(1);
  }
}

// Helper function to validate environment variables
function validateEnvironment() {
  const requiredVars = ["API_KEY"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingVars.forEach((varName) => console.error(`  - ${varName}`));
    console.error(
      "\nPlease set these variables in your .env file or environment."
    );
    process.exit(1);
  }

  if (WORKFLOW_ID === "your-workflow-id-here") {
    console.warn("⚠️  Warning: WORKFLOW_ID is set to default value.");
    console.warn("   Please set WORKFLOW_ID in your .env file or environment.");
    console.warn("   Example: WORKFLOW_ID=your-actual-workflow-id");
  }

  if (CONTRACT_ADDRESS === "0x1234567890123456789012345678901234567890") {
    console.warn("⚠️  Warning: CONTRACT_ADDRESS is set to default value.");
    console.warn(
      "   Please set CONTRACT_ADDRESS in your .env file or environment."
    );
    console.warn("   Example: CONTRACT_ADDRESS=0xYourActualContractAddress");
  }
}

// Run validation before main execution
validateEnvironment();

// Execute the main function
main();

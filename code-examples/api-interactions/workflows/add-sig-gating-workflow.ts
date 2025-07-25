import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { API_BASES } from "../apiBases";

// Charge les variables d'environnement depuis le fichier .env à la racine du projet
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PRODUCTION_TYPE = process.env.PRODUCTION_TYPE || "prod";
const API_BASE = API_BASES[PRODUCTION_TYPE] || API_BASES["prod"];
const API_URL = `${API_BASE}/workflows-engine/sig-gating`;
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set in environment variables.");
  process.exit(1);
}

const createWorkflowData = {
  displayName: "Test Sig Gating Workflow",
};

async function main() {
  try {
    console.log(`Using API base: ${API_BASE}`);
    console.log(`Full URL: ${API_URL}`);
    if (!API_KEY) {
      console.error("API_KEY is not set in environment variables.");
      process.exit(1);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(createWorkflowData),
    });

    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

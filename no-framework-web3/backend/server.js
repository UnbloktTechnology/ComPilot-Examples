const { createSdk } = require("@compilot/js-sdk");
require("dotenv").config();

const apiClient = createSdk({
  webhookSecret: process.env.WEBHOOK_SECRET,
  apiKey: process.env.API_KEY,
});

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5002;

// Middleware
app.use(cors()); // Allows frontend to access the API
app.use(express.json());

// API routes

//WEB3 route
app.post("/api/generate-web3-challenge", async (req, res) => {
  const sessionRes = await apiClient.createWeb3Challenge({
    workflowId: process.env.WEB3_WORKFLOW_ID,
    ...req.body,
  });
  res.status(200).json(sessionRes);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

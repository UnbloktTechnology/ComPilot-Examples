const { createSdk } = require("@compilot/js-sdk");
require("dotenv").config();
const { WEBHOOK_SECRET, REGULAR_WORKFLOW_ID, API_KEY, CUSTOMER_ID, CUSTOMER_EMAIL, CUSTOMER_PHONE, CUSTOMER_WALLET_ADDRESS, CUSTOMER_WALLET_NAMESPACE } = process.env;


const apiClient = createSdk({
  webhookSecret: WEBHOOK_SECRET,
  apiKey: API_KEY,
});

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows frontend to access the API
app.use(express.json());

// Allow updating more customer informations if defined.
const customerInformation = {
  externalCustomerId: CUSTOMER_ID,
  information: {}
};

// Conditionally add optional fields if they are defined
if (CUSTOMER_EMAIL) {
  customerInformation.information.email = CUSTOMER_EMAIL;
}

if (CUSTOMER_PHONE) {
  customerInformation.information.phone = CUSTOMER_PHONE;
}

if (CUSTOMER_WALLET_ADDRESS || CUSTOMER_WALLET_NAMESPACE) {
  customerInformation.information.wallet = {};

  if (CUSTOMER_WALLET_ADDRESS) {
    customerInformation.information.wallet.address = CUSTOMER_WALLET_ADDRESS;
  }

  if (CUSTOMER_WALLET_NAMESPACE) {
    customerInformation.information.wallet.namespace = CUSTOMER_WALLET_NAMESPACE;
  }
}

// API routes

//Regular route. CUSTOMER_ID must be replaced. You need to authenticate the user before opening a compilot user session.
app.post("/api/create-session", async (req, res) => {
  try {
    // Create the session
    const sessionRes = await apiClient.createSession({
      workflowId: REGULAR_WORKFLOW_ID,
      externalCustomerId: CUSTOMER_ID,
    });

    // Attach customer information
    await apiClient.attachCustomerInformation(customerInformation);

    // Send response after both calls succeed
    res.status(200).json(sessionRes);

  } catch (error) {
    // Handle errors and return a 500 status
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating the session." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

# Signature Gating Workflow Scripts

This directory contains scripts for managing signature gating workflows using the ComPilot API.

## Scripts

### 1. `add-sig-gating-workflow.ts`
Creates a new signature gating workflow.

**Usage:**
```bash
npm run add-workflow
```

### 2. `update-sig-gating-workflow.ts`
Updates an existing signature gating workflow by adding:
- A custom contract (via blockchain-api endpoint)
- A custom rule/scenario (via scenarios-api endpoint)

**Usage:**
```bash
npm run update-workflow
```

## Environment Variables

Copy `env.example` to `.env` in the `api-interactions` directory and update the values:

```bash
cp env.example .env
```

Then edit the `.env` file with your actual values:

```env
# Required
API_KEY=your_api_key_here

# Optional (with defaults)
PRODUCTION_TYPE=prod  # Options: cicd, local, dev, stage, prod, test-dev-1, test-dev-2, test-dev-3, test-dev-4

# For update-sig-gating-workflow.ts
WORKFLOW_ID=your_workflow_id_here
CONTRACT_ADDRESS=0xYourContractAddress
CHAIN_ID=1  # Ethereum mainnet
```

## API Endpoints Used

Based on the [ComPilot API documentation](https://api.bjrcom.xyz/swagger):

### Sig Gating Workflows API

1. **Create Workflow**: `POST /workflows-engine/sig-gating`
   - Used in `add-sig-gating-workflow.ts`

2. **Get Workflow**: `GET /workflows-engine/sig-gating/{workflowId}`
   - Used in `update-sig-gating-workflow.ts`

3. **Add Custom Contract**: `POST /workflows-engine/sig-gating/{workflowId}/blockchain-api`
   - Used in `update-sig-gating-workflow.ts`
   - Allows adding an allowed contract to the workflow

4. **Add Custom Scenario**: `POST /workflows-engine/sig-gating/{workflowId}/scenarios-api`
   - Used in `update-sig-gating-workflow.ts`
   - Allows adding a custom rule/scenario to the workflow

## Example Usage

1. **Create a new workflow:**
   ```bash
   cd code-examples/api-interactions
   npm run add-workflow
   ```

2. **Update an existing workflow:**
   ```bash
   cd code-examples/api-interactions
   # Set your workflow ID and contract details in .env
   npm run update-workflow
   ```

## Customization

### Custom Contract Configuration
In `update-sig-gating-workflow.ts`, you can modify the `customContractData` object:

```typescript
const customContractData = {
  contractAddress: CONTRACT_ADDRESS,
  chainId: CHAIN_ID,
  contractType: "ERC20", // or "ERC721", "ERC1155", etc.
  name: "My Custom Token",
  symbol: "MCT",
  decimals: 18,
};
```

### Custom Scenario Configuration
Modify the `customScenarioData` object to create different types of rules:

```typescript
const customScenarioData = {
  name: "Custom Balance Check",
  description: "Check if user has minimum balance of custom token",
  type: "balance_check",
  parameters: {
    minBalance: "1000000000000000000", // 1 token in wei
    operator: "gte", // greater than or equal
  },
  conditions: [
    {
      field: "balance",
      operator: "gte",
      value: "1000000000000000000",
    },
  ],
};
```

## Error Handling

The scripts include comprehensive error handling:
- Environment variable validation
- API response validation
- Detailed error messages with HTTP status codes
- Graceful failure with process exit codes

## Dependencies

Make sure you have the required dependencies installed:
```bash
npm install node-fetch dotenv
``` 
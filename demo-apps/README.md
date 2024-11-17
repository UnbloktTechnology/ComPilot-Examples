# Example apps

This repo contains several example apps that illustrate how to use the ComPilot Identity SDK. You can safely interact with them to get to know ComPilot. There are live versions of the apps on <https://examples.compilot.ai>.

- Compliant Uniswap: An example DeFi app that requires signer interaction with the ComPilot Identity SDK, and has an example swapping process.
- Gated Uniswap: An example DeFi app that requires signer interaction with the ComPilot Identity SDK, and has an example swapping process. Off-chain verification.
- Banking: An example bank app that does not require signer interaction with the ComPilot Identity SDK.
- Web3 Banking: An example Web3 bank app that requires signer interaction with the ComPilot Identity SDK.
- KYC: A simple KYC example flow, using the ComPilot Identity SDK.

Follow these steps to run the example apps locally.

1. Copy `example-apps/.env.local` to `example-apps/.env`.

2. Edit `example-apps/.env` as described in the following table.

   | Variable                                 | Description                                        |
   | ---------------------------------------- | -------------------------------------------------- |
   | `NODE_ENV`                               | Set to `production`                                |
   | `NEXT_PUBLIC_ENVIRONMENT`                | Set to `prod`                                      |
   | `UPSTASH_REDIS_REST_TOKEN`               | The token for the Upstash Redis REST API           |
   | `UPSTASH_REDIS_REST_URL`                 | The URL of the Upstash Redis REST API              |
   | `COMPILOT_API_KEY_BANK`                  | ComPilot API key for the banking app               |
   | `COMPILOT_WORKFLOW_ID_BANK`              | ComPilot workflow ID for the banking app           |
   | `COMPILOT_API_KEY_BANK_WEB3`             | ComPilot API key for the Web3 banking app          |
   | `COMPILOT_WORKFLOW_ID_BANK_WEB3`         | ComPilot workflow ID for the Web3 banking app      |
   | `COMPILOT_API_KEY_DEFI_RULE_ENGINE`      | ComPilot API key for the compliant Uniswap app     |
   | `COMPILOT_WORKFLOW_ID_DEFI_RULE_ENGINE`  | ComPilot workflow ID for the compliant Uniswap app |
   | `COMPILOT_API_KEY_DEFI_OFFCHAIN_ZKP`     | ComPilot API key for the gated Uniswap app         |
   | `COMPILOT_WORKFLOW_ID_DEFI_OFFCHAIN_ZKP` | ComPilot workflow ID for the gated Uniswap app     |
   | `COMPILOT_API_KEY_KYC`                   | ComPilot API key for the KYC app                   |
   | `COMPILOT_WORKFLOW_ID_KYC`               | ComPilot workflow ID for the KYC app               |
   | `COMPILOT_API_KEY_MULTICHAIN_DEMO`       | ComPilot API key for the multichain demo app       |
   | `COMPILOT_WORKFLOW_ID_MULTICHAIN_DEMO`   | ComPilot workflow ID for the multichain demo app   |
   | ---                                      | ---                                                |
   | `COMPILOT_API_KEY_DEFI_OFFCHAIN_ZKP`     | ComPilot API key for the gated Uniswap app         |
   | `COMPILOT_API_KEY_BANK_WEB3`             | ComPilot key for the Web3 banking app              |

   You can get the ComPilot API keys for your apps by following the instructions on [Deploying the ComPilot Identity Widget](../using/setup/application.md#deploying-the-compilot-identity-widget). You need to set each of the `API_KEY` variables, even if you only want to use one of the example apps. If necessary, you can set them all to the same value.

   You can get the values for `UPSTASH_REDIS_REST_TOKEN` and `UPSTASH_REDIS_REST_URL` from <https://console.upstash.com/redis/>.

   :::note
   For more information about these variables, see `example-apps/src/env.mjs`.
   :::

3. Run `npm install` in `example-apps`.

4. Run `npm run dev` in `example-apps`.

The example apps can now be accessed at <http://localhost:3020>.

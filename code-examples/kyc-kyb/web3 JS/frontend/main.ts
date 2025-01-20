import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";
import { mainnet, arbitrum } from "viem/chains";
import { reconnect } from "@wagmi/core";

// 1. Get a project ID at https://cloud.walletconnect.com
const projectId = "YOUR_PROJECT_ID";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3 TS",
  description: "AppKit Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain.
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});
reconnect(config);

// 3. Create modal
const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
});

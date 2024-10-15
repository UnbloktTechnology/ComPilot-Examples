import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy, sepolia } from "viem/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "ComPilot Example apps",
  projectId: "5d874ef9e44150c54831f6ba7e6d6228",
  chains: [polygonAmoy, sepolia],
});

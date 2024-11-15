import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { polygonAmoy, sepolia } from "viem/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "ComPilot Example apps",
  projectId: "5d874ef9e44150c54831f6ba7e6d6228",
  chains: [polygonAmoy, sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_HTTP_PROVIDER_URL),
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_AMOY_HTTP_PROVIDER_URL),
  },
});

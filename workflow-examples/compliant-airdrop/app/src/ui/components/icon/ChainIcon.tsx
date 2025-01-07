import { getDeploymentChain } from "@/config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import Image from "next/image";

export const ChainIcon = ({ chainId }: { chainId: number }) => (
  <Image
    src={`/chain/${chainId}.svg`}
    alt={getDeploymentChain().name + " icon"}
    style={{ display: "inline" }}
    width={24}
    height={25}
  />
);

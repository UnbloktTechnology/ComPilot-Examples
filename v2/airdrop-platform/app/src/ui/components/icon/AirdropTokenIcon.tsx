import { getAirdropTokenConfig } from "@/config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import Image from "next/image";

export const AirdropTokenIcon = () => (
  <Image
    src="/airdrop/airdrop-token-icon.svg"
    alt={getAirdropTokenConfig().symbol + " icon"}
    style={{ display: "inline" }}
    width={24}
    height={25}
  />
);

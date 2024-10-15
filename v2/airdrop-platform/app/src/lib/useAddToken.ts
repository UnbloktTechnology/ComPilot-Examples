import { useWatchAsset } from "wagmi";
import { getAirdropTokenConfig } from "../config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";

export const useAddToken = () => {
  const { watchAsset } = useWatchAsset();

  return () =>
    watchAsset({
      type: "ERC20",
      options: getAirdropTokenConfig(),
    });
};

import { useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { getAirdropTokenConfig } from "../config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { useWalletAddress } from "./useWalletAddress";

export const useGetTokenBalance = () => {
  const { address } = useWalletAddress();

  const { address: erc20Address } = getAirdropTokenConfig();
  // Use this hook to only update nfts after wagmi hook has loaded and nfts are defined
  const exampleTokenContract = {
    address: erc20Address,
    abi: erc20Abi,
  };

  // fetch tokenId
  return useReadContract({
    ...exampleTokenContract,
    functionName: "balanceOf",
    args: [address!],
  });
};
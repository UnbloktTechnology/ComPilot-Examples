import { useReadContract } from "wagmi";

import { getDistributorContractAddress } from "../config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { useWalletAddress } from "./useWalletAddress";
import { getUserIndex } from "./airdropActions";
import { MerkleDistributorAbi } from "../abis/MerkleDistributorAbi";
import { type Address } from "viem";

export const useIsClaimed = (walletAddress?: Address) => {
  let index: bigint | null = 0n;

  const { address: uiAddress } = useWalletAddress();

  const address = walletAddress ?? uiAddress;
  if (address) {
    index = getUserIndex(address);
  }

  const isClaimed = useReadContract({
    address: getDistributorContractAddress(),
    abi: MerkleDistributorAbi,
    functionName: "isClaimed",
    args: [index ?? 0n],
  });

  return isClaimed;
};

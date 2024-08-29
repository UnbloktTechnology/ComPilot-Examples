import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useBlockNumber, useChainId, useReadContract } from "wagmi";
import { useEffect } from "react";
import { erc20Abi } from "viem";
import { getExampleTokenContractAddress } from "./config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";

export const useGetTokenBalance = () => {
  const chainId = useChainId();
  const account = useAccount();

  const erc20Address = getExampleTokenContractAddress(chainId);
  // Use this hook to only update nfts after wagmi hook has loaded and nfts are defined
  const exampleTokenContract = {
    address: erc20Address,
    abi: erc20Abi,
  };
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // fetch tokenId
  const {
    data: balance,
    isError,
    isPending,
    queryKey,
  } = useReadContract({
    ...exampleTokenContract,
    functionName: "balanceOf",
    args: [account.address!],
  });

  // With wagmi v2, this is how we update contract reads
  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return {
    balance: Number(balance) as number | undefined,
    isError: isError,
    isPending: isPending,
  };
};

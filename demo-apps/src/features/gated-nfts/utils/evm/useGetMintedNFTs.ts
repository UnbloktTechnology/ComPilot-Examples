import { useQueryClient } from "@tanstack/react-query";
import {
  useBlockNumber,
  useChainId,
  useReadContract,
  useWatchContractEvent,
  useReadContracts,
} from "wagmi";
import { EvmChainId } from "@nexeraid/identity-schemas";

import {
  ExampleGatedNFTMinterABI,
  ExampleNFTMinterABI,
} from "@nexeraid/sig-gating-contracts-sdk/abis";
import {
  getGatedContractAddress,
  getNonGatedContractAddress,
} from "./getContractAddress";
import type { Address } from "@nexeraid/identity-schemas";
import { useEffect, useState } from "react";
import type { MintedNFT } from "../../components/DisplayMintedNFTs";

export const useGetGatedMintedNFTs = () => {
  const chainId = useChainId();
  // Use this hook to only update nfts after wagmi hook has loaded and nfts are defined
  const [mintedGatedNFTs, setMintedNFTs] = useState<MintedNFT[]>([]);
  const exampleGatedContract = {
    address: getGatedContractAddress(EvmChainId.parse(chainId)),
    abi: ExampleGatedNFTMinterABI,
  };
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // fetch tokenId
  const {
    data: lastTokenId,
    isError: isErrorLastTokenId,
    isPending: isPendingLastTokenId,
    queryKey,
  } = useReadContract({
    ...exampleGatedContract,
    functionName: "lastTokenId",
  });
  const numberOfNFTs = lastTokenId ? Number(lastTokenId) : 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: With wagmi v2, this is how we update contract reads
  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient, queryKey]);

  // for each tokenId, fetch owner
  const { data, isError, isPending } = useReadContracts({
    contracts: Array.from({ length: numberOfNFTs }, (_, i) => {
      return {
        ...exampleGatedContract,
        functionName: "ownerOf",
        args: [i + 1], // Assuming you want to start from 1
        watch: true,
      };
    }),
    query: { enabled: lastTokenId !== undefined },
  });

  // only update nfts after wagmi hook has loaded and nfts are defined
  useEffect(() => {
    if (!(isPendingLastTokenId || isPending) && data) {
      setMintedNFTs(
        data?.map((ownerResponse, i) => {
          return {
            tokenId: i + 1,
            owner: (ownerResponse.result as Address) || undefined,
          };
        }),
      );
    }
  }, [data, isPendingLastTokenId, isPending]);

  // Listen for new Transfer events on the Example NFT
  const [newNFTs, setNewNFTs] = useState<MintedNFT[]>([]);
  function addNewNFT(_newNFT: MintedNFT) {
    setNewNFTs((currentNFTs) => [...currentNFTs, _newNFT]);
  }
  useWatchContractEvent({
    address: getGatedContractAddress(EvmChainId.parse(chainId)),
    abi: ExampleGatedNFTMinterABI,
    eventName: "Transfer",
    onLogs(logs) {
      logs[0]?.args.to &&
        logs[0]?.args.tokenId &&
        logs[0].blockNumber &&
        addNewNFT({
          owner: logs[0]?.args.to,
          tokenId: Number(logs[0]?.args.tokenId),
          blockNumber: Number(logs[0].blockNumber),
          time: Date.now(),
        });
    },
  });

  return {
    newNFTs,
    nfts: mintedGatedNFTs,
    isError: isErrorLastTokenId || isError,
    isPending: isPending || isPendingLastTokenId,
  };
};

export const useGetNonGatedMintedNFTs = () => {
  const chainId = useChainId();
  // Use this hook to only update nfts after wagmi hook has loaded and nfts are defined
  const [mintedGatedNFTs, setMintedNFTs] = useState<MintedNFT[]>([]);
  const exampleGatedContract = {
    address: getNonGatedContractAddress(EvmChainId.parse(chainId)),
    abi: ExampleNFTMinterABI,
  };
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  // fetch tokenId
  const {
    data: lastTokenId,
    isError: isErrorLastTokenId,
    isPending: isPendingLastTokenId,
    queryKey,
  } = useReadContract({
    ...exampleGatedContract,
    functionName: "lastTokenId",
  });
  const numberOfNFTs = lastTokenId ? Number(lastTokenId) : 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: With wagmi v2, this is how we update contract reads
  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient, queryKey]);

  // for each tokenId, fetch owner
  const { data, isError, isPending } = useReadContracts({
    contracts: Array.from({ length: numberOfNFTs }, (_, i) => {
      return {
        ...exampleGatedContract,
        functionName: "ownerOf",
        args: [i + 1], // Assuming you want to start from 1
        watch: true,
      };
    }),
    query: { enabled: lastTokenId !== undefined },
  });

  // only update nfts after wagmi hook has loaded and nfts are defined
  useEffect(() => {
    if (!(isPendingLastTokenId || isPending) && data) {
      setMintedNFTs(
        data?.map((ownerResponse, i) => {
          return {
            tokenId: i + 1,
            owner: (ownerResponse.result as Address) || undefined,
          };
        }),
      );
    }
  }, [data, isPendingLastTokenId, isPending]);

  // Listen for new Transfer events on the Example NFT
  const [newNFTs, setNewNFTs] = useState<MintedNFT[]>([]);
  function addNewNFT(_newNFT: MintedNFT) {
    setNewNFTs((currentNFTs) => [...currentNFTs, _newNFT]);
  }
  useWatchContractEvent({
    address: getNonGatedContractAddress(EvmChainId.parse(chainId)),
    abi: ExampleNFTMinterABI,
    eventName: "Transfer",

    onLogs(logs) {
      logs[0]?.args.to &&
        logs[0]?.args.tokenId &&
        logs[0].blockNumber &&
        addNewNFT({
          owner: logs[0]?.args.to,
          tokenId: Number(logs[0]?.args.tokenId),
          blockNumber: Number(logs[0].blockNumber),
          time: Date.now(),
        });
    },
  });

  return {
    newNFTs,
    nfts: mintedGatedNFTs,
    isError: isErrorLastTokenId || isError,
    isPending: isPending || isPendingLastTokenId,
  };
};

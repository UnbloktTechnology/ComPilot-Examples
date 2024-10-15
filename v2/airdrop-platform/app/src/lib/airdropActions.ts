// TODO ExtendedTxAuthInput shold be exposed in react and web sdks
import { CUSTOMERS_BALANCE_MAP } from "../config/CUSTOMERS_BALANCE_MAP";
import { parseBalanceMap } from "@compilot/merkle-tree-js";
import { type Address, encodeFunctionData, type Hex } from "viem";
import { MerkleDistributorAbi } from "../abis/MerkleDistributorAbi";
import {
  getDeploymentChain,
  getDistributorContractAddress,
} from "../config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { getTxAuthDataSignature } from "@compilot/react-sdk";
import { compilotConfig } from "@/compilotConfig";
import { sendTransaction, waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "@/wagmiConfig";

const balanceMap = parseBalanceMap({ balances: CUSTOMERS_BALANCE_MAP });

export const getUserAirdropAmount = (
  userAddress: Address | undefined | null,
): bigint => {
  if (!userAddress) return 0n;
  const amount = balanceMap.claims[userAddress]?.amount;
  return amount ? BigInt(amount) : 0n;
};

export const isUserQualified = (userAddress: Address): boolean => {
  return !!balanceMap.claims[userAddress];
};

export const getUserIndex = (userAddress: Address): bigint | null => {
  const index = balanceMap.claims[userAddress]?.index;
  return index ? BigInt(index) : null;
};

export const getUserProof = (userAddress: Address): Hex[] | null => {
  const proof = balanceMap.claims[userAddress]?.proof;
  return proof ? (proof as Hex[]) : null;
};

export const claimToken = async (props: { userAddress: Address }) => {
  const { userAddress } = props;

  const amount = getUserAirdropAmount(userAddress);
  const index = getUserIndex(userAddress);
  const proof = getUserProof(userAddress);

  if (index === null || proof === null) {
    throw new Error("User not found");
  }

  const distributorAddress = getDistributorContractAddress();

  const signatureResponse = await getTxAuthDataSignature(compilotConfig, {
    namespace: "eip155",
    userAddress: userAddress,
    contractAbi: Array.from(MerkleDistributorAbi),
    contractAddress: distributorAddress,
    functionName: "claim",
    args: [index.toString(), amount.toString(), proof],
    chainId: getDeploymentChain().parsedId,
  });

  if (!signatureResponse.isAuthorized) throw new Error("User not authorized");

  const unsignedTx = encodeFunctionData({
    abi: Array.from(MerkleDistributorAbi),
    functionName: "claim",
    args: [index, amount, proof],
  });

  const txData = (unsignedTx + signatureResponse.payload) as `0x${string}`;
  const txHash = await sendTransaction(wagmiConfig, {
    to: distributorAddress,
    data: txData,
  });

  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    hash: txHash,
  });

  return {
    txHash,
    distributorAddress,
    txData,
    signatureResponse: {
      isAuthorized: signatureResponse.isAuthorized,
      payload: signatureResponse.payload,
      blockExpiration: signatureResponse.blockExpiration,
    },
    receipt,
  };
};

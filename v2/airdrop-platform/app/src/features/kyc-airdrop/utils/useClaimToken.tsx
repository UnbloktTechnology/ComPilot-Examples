import { useMutation } from "@tanstack/react-query";
import {
  encodeFunctionData,
  type Account,
  type Chain,
  type Client,
  type PublicActions,
  type RpcSchema,
  type Transport,
  type WalletActions,
} from "viem";

import { EvmChainId } from "@nexeraid/identity-schemas";
import { useChainId, useAccount, useSendTransaction } from "wagmi";
import { getDistributorContractAddress } from "./getContractAddress";
import { distributorABI } from "./abis/distributorABI";
import { getUserAllowance, getUserIndex } from "./getUserAllowance";
import { userAllowances } from "./merkle-tree/complex_example";
import { createBalanceTree } from "@nexeraid/merkle-tree-js";
import { useGetTxAuthDataSignature } from "@nexeraid/react-sdk";

const tree = createBalanceTree({
  balances: userAllowances.balances.map((balance) => ({
    account: balance.address,
    amount: BigInt(balance.earnings),
  })),
});

export type WalletClientExtended = Client<
  Transport,
  Chain,
  Account,
  RpcSchema,
  PublicActions & WalletActions<Chain, Account>
>;
export const useClaimToken = () => {
  const chainId = useChainId();
  const account = useAccount();
  const sendTx = useSendTransaction();
  const getTxAuthDataSignature = useGetTxAuthDataSignature();

  return useMutation({
    mutationFn: async () => {
      try {
        if (!account.address) {
          throw new Error("No account in wallet Client - address");
        }

        // build inputs
        const amount = getUserAllowance(account.address);
        const index = getUserIndex(account.address);
        const proof = tree.getProof(
          {
            account: account.address,
            index: BigInt(index),
            amount: BigInt(amount ?? 0),
          },
        );
        const signatureResponse = await getTxAuthDataSignature({
          namespace: "eip155",
          userAddress: account.address,
          contractAbi: Array.from(distributorABI),
          contractAddress: getDistributorContractAddress(
            EvmChainId.parse(chainId),
          ),
          functionName: "claim",
          args: [index, account.address, amount, proof],
          chainId: EvmChainId.parse(chainId),
        });

        // If user is not authorized return empty
        if (!signatureResponse.isAuthorized) {
          return {
            txHash: "0x",
            signatureResponse,
          };
        }

        const blockExpiration = signatureResponse.blockExpiration;

        const payload = signatureResponse.payload;

        // Create function call data
        const unsignedTx = encodeFunctionData({
          abi: Array.from(distributorABI),
          functionName: "claim",
          args: [index, account.address, amount, proof],
        });

        // Complete data with payload from UI (require blockExpiration+ signature)
        const txData = (unsignedTx + payload) as `0x${string}`;

        // Claim with signature
        const result = await sendTx.sendTransactionAsync({
          to: getDistributorContractAddress(EvmChainId.parse(chainId)),
          data: txData,
        });

        return {
          txHash: result,
          signatureResponse: {
            isAuthorized: signatureResponse.isAuthorized,
            payload,
            blockExpiration,
          },
        };
      } catch (e) {
        console.error(e)
        console.log("error during getTxAuthDataSignature");
        return {
          signatureResponse: {
            isAuthorized: false,
          },
          error: (e as Error).toString().substring(0, 108),
        };
      }
    },
  });
};

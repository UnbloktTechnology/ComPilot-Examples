import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWalletClient,
  useChainId,
  useWaitForTransactionReceipt,
} from "wagmi";

import { ExampleNFTMinterABI } from "@nexeraid/sig-gating-contracts-sdk/abis";

import type { MintResponse } from "../utils/evm/evm.schema";
import {
  useGetGatedMintedNFTs,
  useGetNonGatedMintedNFTs,
} from "../utils/evm/useGetMintedNFTs";
import { useMintGatedNFTFromSDK } from "../utils/evm/useMintNFT";

import { DisplayMintResponse } from "./DisplayMintResponse";
import { DisplayMintedNFTs } from "./DisplayMintedNFTs";
import { getNonGatedContractAddress } from "../utils/evm/getContractAddress";
import { EvmChainId } from "@nexeraid/identity-schemas";

const buttonStyle = {
  padding: "16px 24px",
  borderRadius: 16,
  cursor: "pointer",
  backgroundColor: "#0258FD",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
  border: "none",
};

export const GatedNFT = () => {
  const { data: walletClient } = useWalletClient();
  const account = useAccount();
  const chainId = useChainId();

  const [sdkResponse, setSdkResponse] = useState<MintResponse | undefined>(
    undefined,
  );

  const mintedGatedNFTs = useGetGatedMintedNFTs();
  const mintedNonGatedNFTs = useGetNonGatedMintedNFTs();

  const tryMintingGatedNFTFromSDK = useMintGatedNFTFromSDK();
  const mintGatedSdkTxResult = useWaitForTransactionReceipt({
    hash: tryMintingGatedNFTFromSDK.data?.txHash ?? "0x0",
    query: { enabled: !!tryMintingGatedNFTFromSDK.data?.txHash },
  });

  // sdk contract call NON gated nft
  const mintNonGated = useWriteContract();
  const mintNonGatedTxResult = useWaitForTransactionReceipt({
    hash: mintNonGated.data ?? "0x0",
    query: { enabled: !!mintNonGated.data },
  });
  return (
    <>
      {!account.address && (
        <div>Waiting for Polygon Wallet instantiation...</div>
      )}
      {account.address && (
        <>
          <div className="m-4 w-full border border-black p-4">
            <h1 className={"text-3xl font-bold"}>Gated NFTs</h1>
            <br />
            <button
              type="button"
              style={buttonStyle}
              id="mint-sdk-btn"
              disabled={!walletClient}
              onClick={() => {
                if (walletClient) {
                  void tryMintingGatedNFTFromSDK
                    .mutateAsync()
                    .then((_sdkResponse) =>
                      setSdkResponse(_sdkResponse as MintResponse),
                    );
                } else {
                  console.log("walletClient not loaded");
                }
              }}
            >
              Mint Gated NFT
            </button>
            <br />
            <h2 className={"mt-4 text-2xl font-bold"}>SDK RESPONSE</h2>
            <DisplayMintResponse
              mintResponse={sdkResponse}
              gasCost={mintGatedSdkTxResult.data?.gasUsed}
              writeData={{
                isLoading: tryMintingGatedNFTFromSDK.isPending,
                isSuccess: tryMintingGatedNFTFromSDK.isSuccess,
              }}
              error={tryMintingGatedNFTFromSDK.data?.error}
            />
            <br />
            <DisplayMintedNFTs
              mintedNFTs={mintedGatedNFTs.nfts}
              newNFTs={mintedGatedNFTs.newNFTs}
              title={"Minted Gated NFTs: "}
            />
          </div>
          <br />
          <div className="m-2 w-full border border-black p-4">
            <h1 className={"text-3xl font-bold"}>
              Non Gated NFTs for comparaison
            </h1>
            <br />
            <button
              type="button"
              style={buttonStyle}
              id="mint-non-gated-btn"
              disabled={!walletClient}
              onClick={() => {
                if (!walletClient || !account.address) {
                  console.log("No walletClient or account");
                  return;
                }
                if (walletClient) {
                  mintNonGated.writeContract({
                    address: getNonGatedContractAddress(
                      EvmChainId.parse(chainId),
                    ),
                    abi: ExampleNFTMinterABI,
                    functionName: "mintNFT",
                    args: [account.address],
                  });
                } else {
                  console.log("walletClient not loaded");
                }
              }}
            >
              Mint Non Gated NFT
            </button>

            <h2 className={"text-2xl font-bold"}>Gas Cost</h2>
            {mintNonGatedTxResult.data?.gasUsed
              ? mintNonGatedTxResult.data.gasUsed.toString()
              : "Pending"}
            <div>
              Transaction Status:{" "}
              {mintNonGatedTxResult.isPending
                ? "Pending..."
                : mintNonGatedTxResult.isSuccess
                  ? "Success"
                  : "Failed"}
            </div>
            <br />
            <DisplayMintedNFTs
              mintedNFTs={mintedNonGatedNFTs.nfts}
              title={"Minted NON Gated NFTs: "}
              newNFTs={mintedNonGatedNFTs.newNFTs}
            />
          </div>
        </>
      )}
    </>
  );
};

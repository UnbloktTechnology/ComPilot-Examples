import { NFTClaimerAddressForTezosGhostnet } from "@nexeraid/tezos-sig-gating-contracts-sdk/addresses";
import { useMutation } from "@tanstack/react-query";
import { packDataBytes, Parser } from "@taquito/michel-codec";
import type { MichelsonData, MichelsonType } from "@taquito/michel-codec";
import { RpcClient } from "@taquito/rpc";

import { TezosChainId } from "@nexeraid/identity-schemas";

import { useTezosWallet } from "@/features/root/web3/wallet-hook/useTezosWallet";
import { useGetTxAuthDataSignature } from "@compilot/react-sdk";
import { type TezosImplicitAddress } from "@nexeraid/identity-schemas";

// signer public key
const COMPILOT_SIGNER_PK =
  "edpkurPsQ8eUApnLUJ9ZPDvu98E8VNj4KtJa1aZr16Cr5ow5VHKnz4";

const RPC_ENDPOINT = "https://rpc.ghostnet.teztnets.com/";

const client = new RpcClient(RPC_ENDPOINT);

function convertMint(owner_str: string, token_id: string) {
  const data = `(Pair "${owner_str}" ${token_id})`;
  const type = "(pair address nat)";
  const p = new Parser();
  const dataJSON = p.parseMichelineExpression(data);
  const typeJSON = p.parseMichelineExpression(type);
  const packed = packDataBytes(
    dataJSON as MichelsonData,
    typeJSON as MichelsonType,
  );
  return packed.bytes;
}

export const useMintGatedNFTTezos = () => {
  const { wallet, tezos } = useTezosWallet();
  const { getTxAuthDataSignature } = useGetTxAuthDataSignature();

  return useMutation({
    mutationFn: async () => {
      const activeAccount = await wallet?.client.getActiveAccount();
      const userAddress = activeAccount?.address as
        | TezosImplicitAddress
        | undefined;
      const currentChainId = await client.getChainId();
      if (!tezos) {
        throw new Error("No tezos instantiated");
      }
      const claimerContract = await tezos.wallet.at(
        NFTClaimerAddressForTezosGhostnet,
      );

      if (!activeAccount) {
        throw new Error("No account in wallet Client - address");
      }

      if (!userAddress) {
        throw new Error("No userAddress in wallet Client - data");
      }

      if (!currentChainId) {
        throw new Error("No currentChainId in wallet Client");
      }

      if (!claimerContract) {
        throw new Error("No claimerContract in wallet Client");
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const storage: any = await claimerContract.storage();
        const lastAssetId =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          storage.siggated_extension.extension.lastMinted.toNumber() as number;
        const functionCallArgs = {
          owner: userAddress,
          token_id: (lastAssetId + 1).toString(), //"1",
        };
        const functionCallArgsBytes = convertMint(
          functionCallArgs.owner,
          functionCallArgs.token_id,
        );
        const functionName = "%mint_gated";
        const signatureResponse = await getTxAuthDataSignature({
          namespace: "tezos",
          userAddress,
          contractAddress: NFTClaimerAddressForTezosGhostnet,
          functionName,
          args: functionCallArgsBytes,
          chainID: TezosChainId.parse(currentChainId),
        });

        if (!signatureResponse.isAuthorized) {
          throw new Error("User is not authorized");
        }

        const mintArgs = {
          userAddress,
          expirationBlock: signatureResponse.blockExpiration,
          functionName,
          functionArgs: functionCallArgsBytes,
          signerPublicKey: COMPILOT_SIGNER_PK,
          signature: signatureResponse.signature,
        };

        // CALL contract
        // @ts-expect-error claimerContract is not typed by taquito
        const op = await claimerContract.methodsObject
          .mint_gated(mintArgs)
          .send();
        await op.confirmation(2);

        return {
          txHash: op.opHash,
          signatureResponse: signatureResponse,
        };
      } catch (e) {
        console.error("error during getTxAuthDataSignature", e);
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

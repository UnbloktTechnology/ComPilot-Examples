import { NFTClaimerAddressForTezosGhostnet } from "@nexeraid/tezos-sig-gating-contracts-sdk/addresses";
import { useQuery } from "@tanstack/react-query";
import { TezosToolkit } from "@taquito/taquito";

const RPC_ENDPOINT = "https://rpc.ghostnet.teztnets.com/";

const Tezos = new TezosToolkit(RPC_ENDPOINT);

export const useGetGatedMintedNFTsTezos = () => {
  return useQuery({
    queryKey: ["useGetGatedMintedNFTsTezos"],
    enabled: !!Tezos,
    refetchInterval: 15000, // Refetch every 15000 milliseconds (15 seconds), tezos block time
    queryFn: async () => {
      const claimerContract = await Tezos.contract.at(
        NFTClaimerAddressForTezosGhostnet,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storage: any = await claimerContract.storage();
      const lastAssetId =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        storage.siggated_extension.extension.lastMinted.toNumber() as number;
      const nfts = await Promise.all(
        Array.from({ length: lastAssetId + 1 }, async (_, index) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const owner = (await storage.siggated_extension.ledger.get(
            index,
          )) as string;
          return { tokenId: index, owner };
        }),
      );
      return nfts;
    },
  });
};

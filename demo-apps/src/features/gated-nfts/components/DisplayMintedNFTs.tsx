import {
  shortAddress,
  type BlockchainAddress,
} from "@nexeraid/identity-schemas";
export type MintedNFT = {
  owner: BlockchainAddress;
  tokenId: number;
  isNew?: boolean;
  blockNumber?: number;
  time?: number;
};
export const DisplayMintedNFTs = (props: {
  title: string;
  mintedNFTs: MintedNFT[];
  newNFTs: MintedNFT[];
}) => {
  //clone mintedNFTs
  const displayedNFTs =
    props.mintedNFTs.length > 0 ? [...props.mintedNFTs] : props.newNFTs;

  // update newest nfts
  if (props.mintedNFTs.length > 0) {
    for (const nft of props.newNFTs) {
      displayedNFTs[nft.tokenId - 1] = { ...nft, isNew: true };
    }
  }
  return (
    <div className="mt-2">
      <h2 className={"text-2xl font-bold"}>{props.title}</h2>
      <div className="m-2 h-64 overflow-y-auto border border-black p-4">
        {displayedNFTs.toReversed().map((nft) => {
          return (
            <div
              key={nft.tokenId}
              className={nft.isNew ? "bg-green-100/50" : undefined}
            >
              NFT #{nft.tokenId} Owner: {nft.owner && shortAddress(nft.owner)}
              {nft.blockNumber && ` Block Number: ${nft.blockNumber}`}
              {nft.time && ` Time: ${new Date(nft.time).toISOString()}`}
            </div>
          );
        })}
      </div>
    </div>
  );
};

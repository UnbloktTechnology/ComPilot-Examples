import { CardanoSignature } from "@nexeraid/identity-schemas";
import { useQuery } from "@tanstack/react-query";

export type Cardano = Record<
  string,
  {
    name: string;
    icon: string;
    version: string;
    api?: WalletApi;
    enable: () => Promise<WalletApi>;
    isEnabled: () => Promise<boolean>;
  }
>;

export interface WalletApi {
  getNetworkId: () => Promise<number>;
  getChangeAddress: () => Promise<string>;
  signData: (
    address: string,
    payload: string,
  ) => Promise<{ signature: string; key: string }>;
}

export const signWithCardanoAndGetKey = async (
  messageUtf: string,
  wallet: WalletApi,
) => {
  const [stakeAddrHex, stakeAddrBech32] = await getStakeAddress(wallet);
  if (!stakeAddrHex || !stakeAddrBech32) {
    throw new Error("Error getting stake address");
  }
  const messageHex = Buffer.from(messageUtf).toString("hex");
  const sigData = await wallet.signData(stakeAddrHex, messageHex);
  return {
    signature: CardanoSignature.parse(sigData.signature),
    signerPublicKey: sigData.key,
  };
};

const isBrowser = () => typeof window !== "undefined";

export const getCardano = (): Cardano | undefined => {
  const cardano = isBrowser() ? window.cardano : undefined;
  return cardano;
};

async function getStakeAddress(wallet: WalletApi) {
  let csl;
  try {
    csl = await import("@emurgo/cardano-serialization-lib-browser");
  } catch (error) {
    console.error("Error importing csl", error);
  }
  if (!csl) {
    throw new Error("Error importing csl");
  }
  const networkId = await wallet.getNetworkId();
  const changeAddrHex = await wallet.getChangeAddress();

  // derive the stake address from the change address to be sure we are getting
  // the stake address of the currently active account.
  const changeAddress = csl.Address.from_bytes(
    new Uint8Array(Buffer.from(changeAddrHex, "hex")),
  );
  const stakeCredential =
    csl.BaseAddress.from_address(changeAddress)?.stake_cred();
  if (!stakeCredential) {
    throw new Error("Error getting stake credential");
  }
  const stakeAddress = csl.RewardAddress.new(
    networkId,
    stakeCredential,
  ).to_address();

  return [stakeAddress.to_hex(), stakeAddress.to_bech32()];
}

export const getWallet = async () => {
  const cardano = getCardano()!;
  const wallet = await cardano.yoroi!.enable();
  const [_stakeAddrHex, stakeAddrBech32] = await getStakeAddress(wallet);
  return { wallet: wallet, userAddress: stakeAddrBech32 };
};

export const useCardanoWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["cardanoWallet"],
    queryFn: getWallet,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: false,
  });
  return {
    wallet: data?.wallet,
    address: data?.userAddress,
    connectCardano: refetch,
  };
};

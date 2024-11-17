import { useQuery } from "@tanstack/react-query";

import { CardanoSignature } from "@nexeraid/identity-schemas";

export const formatCardanoAddress = async (rawByteString: string) => {
  // Convert hexadecimal string to Uint8Array
  const bytes = new Uint8Array(
    rawByteString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
  const { Address } = await import("@emurgo/cardano-serialization-lib-browser");
  // Create Address object
  const address = Address.from_bytes(bytes);

  // Convert Address to Bech32 string
  const bech32Address = address.to_bech32();
  console.log("Bech32 Address:", bech32Address);
  return bech32Address;
};

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
  getUtxos: () => Promise<string[] | undefined>;
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign: boolean) => Promise<string>;
  signData: (
    address: string,
    payload: string,
  ) => Promise<{ signature: string; key: string }>;
  submitTx: (tx: string) => Promise<string>;
  getCollateral: () => Promise<string[]>;
  //   experimental: {
  //     getCollateral: () => Promise<string[]>;
  //     on: (eventName: string, callback: Function) => void;
  //     off: (eventName: string, callback: Function) => void;
  //   };
}

export const signWithCardanoAndGetKey = async (
  message: string,
  wallet: WalletApi | undefined,
) => {
  if (!wallet) {
    throw new Error("signWithCardano called before wallet was connected");
  }
  const usedAddresses = await wallet.getUsedAddresses();

  const userAddress = usedAddresses[0];
  const formatedAddress =
    userAddress && (await formatCardanoAddress(userAddress));

  if (!formatedAddress) {
    throw new Error("No user connected in wallet");
  }
  const hexMessage = Buffer.from(message).toString("hex");
  const { signature, key } = await wallet.signData(userAddress, hexMessage);
  return { signature: CardanoSignature.parse(signature), signerPublicKey: key };
};

/**
 * @deprecated: use signWithCardanoAndGetKey instead
 */
export const signWithCardano = async (
  message: string,
  wallet: WalletApi | undefined,
) => {
  const { signature } = await signWithCardanoAndGetKey(message, wallet);
  return signature;
};

const isBrowser = () => typeof window !== "undefined";

export const getCardano = (): Cardano | undefined => {
  const cardano = isBrowser() ? window.cardano : undefined;
  return cardano;
};

export const getWallet = async () => {
  const cardano = getCardano()!;
  const api = await cardano.nami!.enable();

  const usedAddresses = await api.getUsedAddresses();

  const userAddress = usedAddresses[0];
  const formatedAddress =
    userAddress && (await formatCardanoAddress(userAddress));
  console.log("signature: userAddress", userAddress);
  return { wallet: api, userAddress: formatedAddress };
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

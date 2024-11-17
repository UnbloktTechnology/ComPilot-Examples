import type { Keplr } from "@keplr-wallet/types";
import { useQuery } from "@tanstack/react-query";

import {
  type BlockchainId,
  CosmosSignature,
  NEXERA_COSMOS_CHAINS,
} from "@nexeraid/identity-schemas";

export const COSMOS_CHAIN_ID: BlockchainId = NEXERA_COSMOS_CHAINS.COSMOS;

declare global {
  interface Window {
    keplr?: Keplr;
  }
}

export const signWithCosmos = async (
  message: string,
  wallet: Keplr | undefined,
) => {
  // Ensure that Keplr is installed and available
  if (!wallet) {
    throw new Error("Wallet not connected");
  }
  const offlineSigner = wallet.getOfflineSigner(COSMOS_CHAIN_ID);

  const accounts = await offlineSigner.getAccounts();
  const cosmosAddress = accounts[0]?.address;
  if (!cosmosAddress) {
    throw new Error("Wallet not connected - cosmosAddress missing");
  }
  console.log("cosmosAddress", cosmosAddress);

  // Sign the message using Keplr
  const signed = await wallet.signArbitrary(
    COSMOS_CHAIN_ID,
    cosmosAddress,
    message, // Make sure SIGN_MSG is defined somewhere in your code
  );
  console.log("signed.signature", signed.signature);
  // Decode base64 signature to bytes
  const signatureBytes = Uint8Array.from(atob(signed.signature), (c) =>
    c.charCodeAt(0),
  );

  // Convert bytes to hexadecimal string
  const signatureHex = Array.prototype.map
    .call(signatureBytes, (x: number) => ("00" + x.toString(16)).slice(-2))
    .join("");
  console.log("signatureHex", signatureHex);

  // Return the signature
  return CosmosSignature.parse(signatureHex);
};

export const getWallet = async () => {
  if (!window.keplr) {
    throw new Error("Keplr extension not installed or not available");
  }
  await window.keplr.enable(COSMOS_CHAIN_ID);

  const wallet = window.keplr;
  const signer = wallet.getOfflineSigner(COSMOS_CHAIN_ID);
  const accounts = await signer.getAccounts();

  return { wallet, address: accounts[0]?.address };
};

export const useCosmosWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["cosmosWallet"],
    queryFn: getWallet,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: false,
  });
  return { wallet: data, connectCosmos: refetch };
};

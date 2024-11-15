import {
  COSMOS_CHAIN_ID,
  getWallet,
} from "@/features/root/web3/wallet-hook/useCosmosWallet";
import { type Web3Wallet } from "@compilot/react-sdk";
import { toHex } from "viem";

export const cosmosWalletConfig: Web3Wallet = {
  namespace: "cosmos",
  getAddress: async () => {
    const { address } = await getWallet();
    return address;
  },
  sign: async ({ message }) => {
    const { wallet } = await getWallet();
    const offlineSigner = wallet.getOfflineSigner(COSMOS_CHAIN_ID);

    const accounts = await offlineSigner.getAccounts();
    const cosmosAddress = accounts[0]?.address;
    const cosmosPubKey = accounts[0]?.pubkey;
    console.log({ cosmosAddress, cosmosPubKey });
    if (!cosmosAddress) {
      throw new Error("Wallet not connected - cosmosAddress missing");
    }

    // Sign the message using Keplr
    const signed = await wallet.signArbitrary(
      COSMOS_CHAIN_ID,
      cosmosAddress,
      message,
    );

    // Decode base64 signature to bytes
    const signatureBytes = Uint8Array.from(atob(signed.signature), (c) =>
      c.charCodeAt(0),
    );
    const signatureHex = toHex(signatureBytes);

    // Decode base64 public key to bytes
    const publicKeyBytes = Uint8Array.from(atob(signed.pub_key.value), (c) =>
      c.charCodeAt(0),
    );
    const publicKeyHex = toHex(publicKeyBytes);

    return {
      message,
      signature: signatureHex,
      signerPublicKey: publicKeyHex,
      signerPublicKeyType: signed.pub_key.type,
      signedMessage: message,
    };
  },
  isConnected: async () => {
    const { wallet } = await getWallet();
    return Boolean(wallet.version);
  },
  getBlockchainId: () => {
    return COSMOS_CHAIN_ID;
  },
};

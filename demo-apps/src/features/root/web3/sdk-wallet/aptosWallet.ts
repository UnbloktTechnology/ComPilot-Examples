import { getWallet } from "@/features/root/web3/wallet-hook/useAptosWallet";
import { type Web3Wallet } from "@compilot/react-sdk";

export const aptosWalletConfig: Web3Wallet = {
  namespace: "aptos",
  getAddress: async () => {
    const { address } = await getWallet();
    return address;
  },
  sign: async ({ message }) => {
    const { wallet, publicKey } = await getWallet();

    if (!publicKey) {
      throw new Error("Missing pubKey data to authenticate");
    }

    const aptosMessage = {
      address: true,
      application: true,
      chainId: true,
      message,
      nonce: Date.now().toLocaleString(),
    };

    const { signature, fullMessage } = await wallet.signMessage(aptosMessage);
    return {
      message: message,
      signedMessage: fullMessage,
      signature,
      signerPublicKey: publicKey,
    };
  },
  isConnected: async () => {
    const { wallet } = await getWallet();
    return wallet.isConnected();
  },
};

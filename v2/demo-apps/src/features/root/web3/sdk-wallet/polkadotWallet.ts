import { getWallet } from "@/features/root/web3/wallet-hook/usePolkadotWallet";
import { type Web3Wallet } from "@nexeraid/react-sdk";

const getActiveAccount = async () => {
  const wallet = await getWallet();
  const accounts = await wallet.injector?.accounts.get();
  if (!accounts || accounts.length === 0) {
    return null;
  }
  return accounts[0] ?? null;
};

export const polkadotWalletConfig: Web3Wallet = {
  namespace: "polkadot",
  getAddress: async () => {
    const account = await getActiveAccount();
    if (!account) {
      throw new Error("No active account found");
    }
    return account.address;
  },
  sign: async ({ message }) => {
    const wallet = await getWallet();

    const account = await getActiveAccount();
    if (!account) {
      throw new Error("No active account found");
    }

    // Use the injector to sign the message
    const signature =
      wallet.injector?.signer.signRaw &&
      (await wallet.injector.signer.signRaw({
        address: account.address,
        data: message,
        type: "payload",
      }));

    const signerPublicKey = account.address;
    return {
      message,
      signature: signature?.signature ?? "",
      signerPublicKey,
      signerPublicKeyType: account.type,
      signedMessage: message,
    };
  },
  isConnected: async () => {
    const account = await getActiveAccount();
    return !!account;
  },
};

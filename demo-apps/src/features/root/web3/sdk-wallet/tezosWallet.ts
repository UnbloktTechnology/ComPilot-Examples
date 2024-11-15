import { getWallet } from "@/features/root/web3/wallet-hook/useTezosWallet";
import { SigningType } from "@airgap/beacon-types";
import { TezosChainId } from "@nexeraid/identity-schemas";
import { type Web3Wallet } from "@compilot/react-sdk";
import { stringToBytes } from "@taquito/utils";

export const tezosWalletConfig: Web3Wallet = {
  namespace: "tezos",
  getAddress: async () => {
    const wallet = await getWallet();
    const activeAccount = await wallet.wallet.client.getActiveAccount();
    return activeAccount?.address;
  },
  sign: async ({ message }) => {
    const wallet = await getWallet();

    const activeAccount = await wallet.wallet.client.getActiveAccount();
    const signerPublicKey = activeAccount?.publicKey ?? "";

    const bytes = stringToBytes(message);
    const bytesLength = (bytes.length / 2).toString(16);
    const addPadding = `00000000${bytesLength}`;
    const paddedBytesLength = addPadding.slice(addPadding.length - 8);
    const payloadBytes = "05" + "01" + paddedBytesLength + bytes;

    const { signature } = await wallet.wallet.client.requestSignPayload({
      signingType: SigningType.MICHELINE,
      payload: payloadBytes,
    });

    return {
      message,
      signature,
      signerPublicKey,
      signedMessage: payloadBytes,
    };
  },
  isConnected: async () => {
    const wallet = await getWallet();
    const activeAccount = await wallet.wallet.client.getActiveAccount();
    return Boolean(activeAccount);
  },
  getBlockchainId: async () => {
    const wallet = await getWallet();
    const chainId = await wallet.rpc.getChainId();
    return TezosChainId.parse(chainId);
  },
};

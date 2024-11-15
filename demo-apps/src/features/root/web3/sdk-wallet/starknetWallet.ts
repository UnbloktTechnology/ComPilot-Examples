import { getWallet } from "@/features/root/web3/wallet-hook/useStarknetWallet";
import { StarknetChainId } from "@nexeraid/identity-schemas";
import { type Web3Wallet } from "@compilot/react-sdk";
import { type AccountInterface, type ArraySignatureType, hash } from "starknet";

const getAccount = async (): Promise<AccountInterface> => {
  const wallet = await getWallet();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const account: AccountInterface = wallet.account;

  if (!account?.signer) {
    throw new Error("signWithStarknet called before wallet was connected");
  }

  return account;
};

export const starknetWalletConfig: Web3Wallet = {
  namespace: "starknet",
  getAddress: async () => {
    const account = await getAccount();
    console.log("address", account.address);
    return account.address;
  },
  sign: async ({ message }) => {
    const account = await getAccount();

    // Message must not be too long
    // So we hash it and take the first 31 characters
    const messageHash = hash
      .starknetKeccak(message)
      .toString(16)
      .substring(0, 31);

    const starknetMessage = {
      types: {
        Message: [{ name: "hash", type: "felt" }],
        StarkNetDomain: [{ name: "name", type: "felt" }],
      },
      primaryType: "Message",
      domain: {
        name: "ComPilot Auth Message",
      },
      message: {
        hash: messageHash,
      },
    };

    const signature = (await account.signMessage(
      starknetMessage,
    )) as ArraySignatureType;
    if (!signature[0] || !signature[1]) {
      throw new Error("returned starknet signature is wrong format");
    }

    // It has to be formated to a single string for the purpose of polygon id derivation
    const formatedSignature = signature.join(" ");

    return {
      message,
      signature: formatedSignature,
      // Currently, the public key cannot be retrieved through the browser wallet.
      signerPublicKey: "0x0",
      signedMessage: messageHash,
    };
  },
  isConnected: async () => {
    const account = await getAccount();
    return account?.signer !== undefined;
  },

  getBlockchainId: async () => {
    const wallet = await getWallet();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return StarknetChainId.parse(wallet.provider.chainId);
  },
};

import { useQuery } from "@tanstack/react-query";
import { hash } from "starknet";
import type { AccountInterface, ArraySignatureType } from "starknet";
import { connect } from "starknetkit";

import { StarknetSignature } from "@nexeraid/identity-schemas";

export const signWithStarknet = async (
  message: string,
  account: AccountInterface | undefined,
) => {
  if (!account?.signer) {
    throw new Error("signWithStarknet called before wallet was connected");
  }
  // Message must be hashed in order to be signed by starknet
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

  // This returns a tuple of two numbers (r,s)
  const signature = (await account.signMessage(
    starknetMessage,
  )) as ArraySignatureType;
  if (!signature[0] || !signature[1]) {
    throw new Error("returned starknet signature is wrong format");
  }
  // It has to be formated to a single string for the purpose of polygon id derivation
  const formatedSignature =
    "0x" +
    BigInt(signature[0]).toString(16) +
    BigInt(signature[1]).toString(16);

  return StarknetSignature.parse(formatedSignature);
};

export const getWallet = async () => {
  const connection = await connect();
  if (!connection.wallet) {
    throw new Error("could not fetch starknet wallet");
  }

  return connection.wallet;
};

export const useStarknetWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["starknetWallet"],
    queryFn: getWallet,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: false,
  });
  return {
    wallet: data,
    connectStarknet: refetch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    address: data?.account?.address as string,
  };
};

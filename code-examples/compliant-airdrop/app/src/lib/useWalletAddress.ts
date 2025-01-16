import { useRouter } from "next/router";
import { type Address } from "viem";
import { useAccount } from "wagmi";

export const useWalletAddress = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  return {
    address: (address ?? (router.query.address as string | undefined)) as
      | Address
      | undefined,
    isConnected,
  };
};

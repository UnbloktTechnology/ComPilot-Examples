import { useQuery } from "@tanstack/react-query";

import { executeEngine } from "@/utils/executeEngine";
import { useAccount } from "wagmi";

export const useCheckBankWeb3Compliance = (enabled: boolean) => {
  const account = useAccount();

  return useQuery({
    queryKey: ["checkBankWeb3Compliance", enabled],
    queryFn: async () => {
      if (!account)
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });

      if (!account.address) {
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });
      }

      const result = await executeEngine(
        {
          address: account.address,
          blockchainNamespace: "eip155",
        },
        "bank-web3",
      );
      return result;
    },
    enabled,
  });
};

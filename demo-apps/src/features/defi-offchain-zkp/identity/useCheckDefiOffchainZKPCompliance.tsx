import { useQuery } from "@tanstack/react-query";
import { executeEngine } from "@/utils/executeEngine";
import { useAccount } from "wagmi";

export const useCheckCompliance = (enabled: boolean) => {
  const account = useAccount();

  return useQuery({
    queryKey: ["checkDefiOffChainZKPCompliance", enabled],
    queryFn: async () => {
      if (!account.address)
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });

      const result = await executeEngine(
        {
          address: account.address,
          blockchainNamespace: "eip155",
        },
        "defi-offchain-zkp",
      );
      console.log("isCompliant result", result);
      return result;
    },
    enabled,
  });
};

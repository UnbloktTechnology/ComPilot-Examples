import { useQuery } from "@tanstack/react-query";
import { executeEngine } from "@/utils/executeEngine";
import { useAccount } from "wagmi";

export const useCheckDefiRuleEngineCompliance = (enabled: boolean) => {
  const account = useAccount();
  return useQuery({
    queryKey: ["useCheckDefiRuleEngineCompliance", enabled],
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
        "bank",
      );
      return result;
    },
    enabled,
  });
};

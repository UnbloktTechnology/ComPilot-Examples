import { useQuery } from "@tanstack/react-query";

import { executeEngine } from "@/utils/executeEngine";
import { useMockBankAuth } from "@/features/bank/identity/useMockBankAuth";

export const useCheckBankCompliance = (enabled: boolean) => {
  const { user } = useMockBankAuth();

  return useQuery({
    queryKey: ["checkBankCompliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });
      const result = await executeEngine(
        {
          address: user.walletAddress,
          blockchainNamespace: "eip155",
        },
        "bank",
      );
      return result;
    },
    enabled,
  });
};

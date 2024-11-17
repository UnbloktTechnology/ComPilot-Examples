import { useQuery } from "@tanstack/react-query";

import { executeEngine } from "@/utils/executeEngine";
import { useMockBankKybAuth } from "./useMockBankKybAuth";

export const useCheckBankKYBCompliance = (enabled: boolean) => {
  const { user } = useMockBankKybAuth();

  return useQuery({
    queryKey: ["checkBankKYBCompliance", enabled],
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
        "bank-kyb",
      );
      return result;
    },
    enabled,
  });
};

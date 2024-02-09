import { IDENTITY_CLIENT } from "@/features/defi-rule-engine/identity/IdentityClient";
import { useDefiRuleEngineKycAuthentication } from "./useDefiOffChainZKPKycAuthenticate";

export const IdentityVerifyButton = () => {
  const { isIdentityClientInit } = useDefiRuleEngineKycAuthentication();

  return !isIdentityClientInit ? (
    "Awaiting identity client initialization..."
  ) : (
    <button
      id="kyc-btn-verify"
      className="mt-3 h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
      onClick={() => {
        IDENTITY_CLIENT.startVerification();
      }}
    >
      Verify
    </button>
  );
};

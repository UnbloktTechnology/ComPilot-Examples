import { useIsLoading, useOpenWidget } from "@nexeraid/react-sdk";

export const IdentityVerifyButton = () => {
  const openWidget = useOpenWidget({});
  const isLoading = useIsLoading();
  return (
    <button
      id="kyc-btn-verify"
      className="mt-3 h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
      onClick={openWidget}
      disabled={isLoading}
    >
      Verify
    </button>
  );
};

import { useOpenWidget } from "@compilot/react-sdk";

export const IdentityVerifyButton = () => {
  const openWidget = useOpenWidget();
  return (
    <button
      id="kyc-btn-verify"
      className="mt-3 h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
      onClick={() => void openWidget.openWidget()}
      disabled={openWidget.isPending}
    >
      {openWidget.isPending ? "..." : "Verify"}
    </button>
  );
};

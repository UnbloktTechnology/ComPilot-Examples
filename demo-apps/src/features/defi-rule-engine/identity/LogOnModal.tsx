import { IdentityVerifyButton } from "@/features/defi-rule-engine/identity/IdentityVerifyButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export const LogOnModal = () => {
  const account = useAccount();

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-2xl text-white">
          Verify your identity to be able to swap
        </h3>
      </div>

      <div className="flex w-full flex-col items-center">
        <ConnectButton />
      </div>

      {account.address && <IdentityVerifyButton />}
    </div>
  );
};

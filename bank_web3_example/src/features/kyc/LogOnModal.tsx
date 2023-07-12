import React, { useState } from "react";

import { KycVerifyButton } from "@/features/kyc/KycVerifyButton";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { Icon } from "../Components/Icon";
import { Button } from "../Components/Button";

export const LogOnModal = () => {
  const [showMsg, setShowMsg] = useState(true);
  const [helpMsg, setHelpMsg] = useState(
    "To open an account you will need to verify your identity first"
  );
  const account = useAccount();
  const { authenticate, user, isAuthenticated } = useKycAuthentication();

  const changeHelperText = () => {
    if (helpMsg.includes("verify your identity")) {
      setHelpMsg(
        "We've made some exciting changes to your log on screen. If you can't remember your username, select 'Forgotten username' for more help."
      );
    } else {
      setHelpMsg(
        "To open an account you will need to verify your identity first"
      );
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-2xl">Log on to Online Banking</h3>

        {showMsg && (
          <div className="relative flex items-center justify-between bg-[#EBEFF4] p-5">
            <button className="mr-2 cursor-pointer" onClick={changeHelperText}>
              {}
            </button>

            <p className="mr-2 text-base">{helpMsg}</p>
            <Icon
              icon="exit"
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setShowMsg(false)}
            />
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-center">
        <ConnectButton />
      </div>

      {account.address && !isAuthenticated && (
        <Button
          className={`ml-auto text-base font-bold text-white`}
          onClick={() => {
            if (!account.address) {
              toast("Please connect your wallet first");
              return;
            }
            authenticate.mutate({ user: account.address });
          }}
        >
          Log in
        </Button>
      )}
      {account.address && isAuthenticated && <KycVerifyButton />}

      <div className="flex w-full flex-col justify-start gap-2 text-base">
        <button className="!text-cta-black w-fit text-base font-normal">
          <>
            Forgotten your username?{" "}
            <span className="font-bold text-[#2849F5]">&gt;</span>
          </>
        </button>
        <button className="!text-cta-black w-fit text-base font-normal">
          <>
            Not registered for Online Banking?{" "}
            <span className="font-bold text-[#2849F5]">&gt;</span>
          </>
        </button>
      </div>
    </div>
  );
};

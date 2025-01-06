import React, { useState } from "react";

import { Icon } from "../Components/Icon";
import { Button } from "../Components/Button";
import { useMockBankAuth } from "./useMockBankAuth";
import { IdentityVerifyButton } from "./IdentityVerifyButton";
import useTestUser from "./useTestUser";

export const LogOnModal = () => {
  const [showMsg, setShowMsg] = useState(true);
  const [helpMsg, setHelpMsg] = useState(
    "To open an account you will need to verify your identity first",
  );
  const testUser = useTestUser();
  const { authenticate, user, isAuthenticated } = useMockBankAuth();

  const changeHelperText = () => {
    if (helpMsg.includes("verify your identity")) {
      setHelpMsg(
        "We've made some exciting changes to your log in screen. If you can't remember your username, select 'Forgotten username' for more help.",
      );
    } else {
      setHelpMsg(
        "To open an account you will need to verify your identity first",
      );
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-2xl">Log in to Online Banking</h3>

        {showMsg && (
          <div className="relative flex items-center justify-between bg-[#EBEFF4] p-5">
            <button
              type="button"
              className="mr-2 cursor-pointer"
              onClick={changeHelperText}
            >
              {}
            </button>

            <p className="mr-2 text-base">{helpMsg}</p>

            <Icon
              className="cursor-pointer"
              icon="exit"
              onClick={() => setShowMsg(false)}
            />
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-center">
        <div className={`relative flex w-auto w-full items-center`}>
          <div
            className={`flex inline-flex w-full items-center justify-between gap-3 border-[#D0D5DD] px-3 py-2 shadow-sm`}
          >
            {testUser?.avatar ? (
              <>
                <Icon icon={testUser?.avatar} />
                <span className="w-full text-left">{testUser?.name}</span>
              </>
            ) : (
              <span>Select user</span>
            )}
          </div>
        </div>
      </div>

      <IdentityVerifyButton />

      <div className="flex w-full flex-col justify-start gap-2 text-base">
        <button
          type="button"
          className="!text-cta-black flex w-fit flex-row text-base font-normal"
        >
          <div className="flex flex-row gap-2">
            Forgotten your username? <Icon icon="expand-arrow-bold" />
          </div>
        </button>
        <button
          type="button"
          className="!text-cta-black flex w-fit flex-row text-base font-normal"
        >
          <div className="flex flex-row gap-2">
            Not registered for Online Banking? <Icon icon="expand-arrow-bold" />
          </div>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from "react";

import { UsersDropDown } from "../Components/UsersDropDown";
import { IdentityVerifyButton } from "@/features/bank-kyb/identity/IdentityVerifyButton";
import { TEST_USERS, type TestUser } from "@/appConfig";
import { toast } from "react-toastify";
import { Icon } from "../Components/Icon";
import { Button } from "../Components/Button";
import { useMockBankKybAuth } from "./useMockBankKybAuth";

export const LogOnModal = () => {
  const [showMsg, setShowMsg] = useState(true);
  const [helpMsg, setHelpMsg] = useState(
    "To open an Green Bank account you will need to verify your identity first",
  );
  const [userSelected, setUserSelected] = useState<TestUser>();
  const { authenticate, user, isAuthenticated } = useMockBankKybAuth();

  const handleUserSelected = (user: TestUser) => {
    setUserSelected(user);
  };

  const changeHelperText = () => {
    if (helpMsg.includes("verify your identity")) {
      setHelpMsg(
        "We've made some exciting changes to your log in screen. If you can't remember your username, select 'Forgotten username' for more help.",
      );
    } else {
      setHelpMsg(
        "To open an Green Bank account you will need to verify your identity first",
      );
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-2xl">Log in to Online Banking</h3>

        {showMsg && (
          <div className="relative flex items-center justify-between bg-[#EBEFF4] p-5">
            <button className="mr-2 cursor-pointer" onClick={changeHelperText}>
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
        <UsersDropDown
          items={TEST_USERS}
          selected={userSelected}
          onSelect={handleUserSelected}
          className="relative w-full"
          classNameButton="w-full flex justify-between border-[#D0D5DD]"
          classNameList="bg-white"
        />
      </div>

      {user?.id !== userSelected?.id && (
        <Button
          disabled={typeof userSelected === "undefined"}
          className={`ml-auto ${
            typeof userSelected === "undefined" ? "opacity-50" : ""
          }`}
          onClick={() =>
            userSelected
              ? authenticate.mutate({ user: userSelected })
              : toast("Please select a user")
          }
        >
          Log in
        </Button>
      )}
      {user?.id === userSelected?.id && isAuthenticated && (
        <IdentityVerifyButton />
      )}

      <div className="flex w-full flex-col justify-start gap-2 text-base">
        <button className="!text-cta-black flex w-fit flex-row text-base font-normal">
          <div className="flex flex-row gap-2">
            Forgotten your username? <Icon icon="expand-arrow-bold" />
          </div>
        </button>
        <button className="!text-cta-black flex w-fit flex-row text-base font-normal">
          <div className="flex flex-row gap-2">
            Not registered for Online Banking? <Icon icon="expand-arrow-bold" />
          </div>
        </button>
      </div>
    </div>
  );
};

import { useGlobalModals } from "@/features/defi-rule-engine/Modals/Hooks/useGlobalModals";
import { useQueryClient } from "@tanstack/react-query";
import { SwapInput } from "./SwapInput";
import type { ITokenInfo } from "@/features/defi-rule-engine/Components/TokenDropDown";
import { Icon } from "./Icon";
import { useAccount } from "wagmi";
import { SwapButton } from "@/features/defi-rule-engine/Components/SwapButton";
import { useState } from "react";
import {
  type ChainOptions,
  SwapOptions,
} from "@/features/defi-rule-engine/SwapOptionsDemoData";
import { useCustomerStatus } from "@compilot/react-sdk";

const optionsToSwap = (options: ITokenInfo[], tokenInfo: ITokenInfo) => {
  return options?.filter((token) => token.value !== tokenInfo.value);
};

export const Swap = () => {
  const { chain } = useAccount();
  const options = SwapOptions[(chain?.id as ChainOptions) ?? "80002"];
  const customerStatus = useCustomerStatus();
  const isCompliant = customerStatus.data === "Active";

  const [fromAmount, setFromAmount] = useState("0");
  const [fromToken, setFromToken] = useState<ITokenInfo>(
    options?.[0] ?? {
      value: "select",
      label: "Select Token",
      address: "",
      pairs: [],
    },
  );
  const [toAmount, setToAmount] = useState("0");
  const [toToken, setToToken] = useState<ITokenInfo>({
    value: "select",
    label: "Select Token",
    address: "",
    pairs: [],
  });
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
  }));
  const queryClient = useQueryClient();

  const verifyUser = () => {
    openModal(
      "LogOnModal",
      {
        modalType: "center",
        overlayType: "dark",
      },
      {
        basicData: {
          text: "Verify your identity on-chain to be able to swap assets on our Protocol",
          icon: "kyc",
          onClick: () => {
            void queryClient.invalidateQueries();
            close();
          },
        },
      },
    );
  };

  const handleFromValues = (value: string, token: ITokenInfo) => {
    setFromAmount(value);
    const toAmount = 2 * Number(value);
    setToAmount(toAmount.toString());
    setFromToken(token);
  };

  const handleToValues = (value: string, token: ITokenInfo) => {
    setToAmount(value);
    const fromAmount = Number(value) / 2;
    setFromAmount(fromAmount.toString());
    setToToken(token);
  };

  const handleSwapFrom = () => {
    const fromAmountCopy = fromAmount;
    const fromTokenCopy = fromToken;

    setFromAmount(toAmount);
    setToAmount(fromAmountCopy);
    setFromToken(toToken);
    setToToken(fromTokenCopy);
  };

  return (
    <div className="relative z-10 mx-auto mt-20 w-[464px]">
      <div className="flex w-full flex-col gap-1 rounded-xl bg-[#0D111C] p-4">
        <div className="flex flex-col">
          <div className="mx-2 mb-3 flex justify-between">
            <span className="text-base font-bold text-white">Swap</span>
            <Icon icon="config" size={20} className="cursor-pointer" />
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <div className="relative flex w-full flex-col items-center justify-center gap-1">
              <SwapInput
                value={fromAmount.toString()}
                token={fromToken}
                options={optionsToSwap(options, toToken)}
                className="h-24 w-full rounded-xl bg-[#131A2A] text-white"
                classNameInput="text-4xl text-[#5D6785] w-[280px]"
                classNameDropDownButton="border-0 font-semibold text-xl bg-[#293249] rounded-2xl h-8"
                classNameDropDownList="font-semibold text-xl bg-[#293249] rounded-2xl"
                onChange={(value, token) => handleFromValues(value, token)}
              />
              <div className="absolute z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border-4 border-[#0D111C] bg-[#293249]">
                <Icon
                  icon="arrow-down"
                  size={16}
                  onClick={() => handleSwapFrom()}
                  className="font-bold"
                />
              </div>
              <SwapInput
                value={toAmount.toString()}
                token={toToken}
                options={optionsToSwap(options, fromToken)}
                className="h-24 w-full rounded-xl bg-[#131A2A] text-white"
                classNameInput="text-4xl text-[#5D6785] w-[280px]"
                classNameDropDownButton="border-0 font-semibold text-xl bg-[#293249] rounded-2xl h-8"
                classNameDropDownList="font-semibold text-xl bg-[#293249] rounded-2xl"
                onChange={(value, token) => void handleToValues(value, token)}
              />
            </div>
          </div>
        </div>

        {isCompliant && <SwapButton amountWei={fromAmount.toString()} />}
        {!isCompliant && (
          <button
            type="button"
            className="mt-3 h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
            id={"kyc-btn-verify"}
            onClick={verifyUser}
            disabled={customerStatus.isLoading}
          >
            {customerStatus.isLoading
              ? "...Checking"
              : "Prove compliance to swap"}
          </button>
        )}
        {customerStatus.isError && (
          <div className="mt-3 h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]">
            {customerStatus.error.message}
          </div>
        )}
      </div>
    </div>
  );
};

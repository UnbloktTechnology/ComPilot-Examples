import * as React from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useSimulateContract,
} from "wagmi";
import { parseEther, parseGwei } from "viem";
import { mockSwapABi } from "@/features/defi-offchain-zkp/Components/abi";
import { useDebounce } from "@/features/root/useDebounce";

export const SwapButton = (props: { amountWei: string }) => {
  console.log("swap amount in matic: ", { amount: parseGwei(props.amountWei) });
  const debouncedTokenAmount = useDebounce(props.amountWei, 500);
  const { data, isLoading, isError, error, isSuccess } = useSimulateContract({
    address: "0xE352c14Dc08c280c8dA46D047D62FF29bc0e0F6a",
    abi: mockSwapABi,
    functionName: "swapNativeForUSDT",
    value: parseEther(props.amountWei, "wei"),
  });
  console.log("swap data: ", data);
  const contractWrite = useWriteContract();

  const waitForTransaction = useWaitForTransactionReceipt({
    hash: contractWrite.data,
    confirmations: 3,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!data) return;
        contractWrite.writeContract?.(data.request);
      }}
    >
      {isLoading && (
        <button
          type="submit"
          disabled={true}
          className="mt-3 h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
        >
          Loading
        </button>
      )}
      {!isLoading && (
        <button
          type="submit"
          disabled={
            isLoading ||
            !isSuccess ||
            !contractWrite.writeContract ||
            waitForTransaction.isLoading ||
            !debouncedTokenAmount ||
            debouncedTokenAmount === "0"
          }
          className="mt-3 h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
        >
          {contractWrite.isPending && "Confirm tx in MM"}
          {waitForTransaction.isLoading ? "Swapping..." : "Swap"}
        </button>
      )}
      {isError && (
        <div className="text-red-500">Failed to swap: {error.message}</div>
      )}
      {waitForTransaction.isSuccess && contractWrite.data && (
        <div className="text-green-600">
          Successfully swapped
          <div>
            <a href={`https://amoy.polygonscan.com/tx/${contractWrite.data}`}>
              Polygon Amoy
            </a>
          </div>
        </div>
      )}
    </form>
  );
};

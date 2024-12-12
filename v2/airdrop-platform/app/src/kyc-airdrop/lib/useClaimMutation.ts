import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { claimToken } from "./airdropActions";
import {
  useRedirectToClaimError,
  useRedirectToClaimSuccess,
} from "./navigation";
import { TransactionExecutionError, UserRejectedRequestError } from "viem";

export const useClaimMutation = () => {
  const account = useAccount();
  const accountAddress = account.address!;

  const redirectToClaimSuccess = useRedirectToClaimSuccess();
  const redirectToClaimError = useRedirectToClaimError();

  return useMutation({
    mutationFn: async () => {
      try {
        const result = await claimToken({
          userAddress: accountAddress,
        });
        return result;
      } catch (error) {
        if (error instanceof UserRejectedRequestError) {
          return error;
        }
        if (
          error instanceof TransactionExecutionError &&
          error.cause instanceof UserRejectedRequestError
        ) {
          return error.cause;
        }

        throw error;
      }
    },
    onSuccess: (sdkResponse) => {
      if (sdkResponse instanceof UserRejectedRequestError) {
        return;
      }

      if (sdkResponse?.signatureResponse.isAuthorized) {
        return redirectToClaimSuccess(accountAddress);
      }
      return redirectToClaimError(
        accountAddress,
        "You are not authorized to claim tokens, please retry the identity verification process",
      );
    },
    onError: (error) => {
      console.error("Error while fetching signature", error);
      redirectToClaimError(accountAddress, "Error while fetching signature");
    },
  });
};
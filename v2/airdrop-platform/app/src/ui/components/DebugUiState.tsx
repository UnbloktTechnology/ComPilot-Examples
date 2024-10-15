import { useClaimMutation } from "@/lib/useClaimMutation";
import { useCurrentUiStep, useClaimUiState } from "@/lib/useClaimUiState";
import {
  useAuthenticate,
  useCustomerStatus,
  useOpenWidget,
} from "@compilot/react-sdk";

import { useRouter } from "next/router";
import { useChainId } from "wagmi";
import { useIsClaimed } from "@/lib/useIsClaimed";

export const DebugUiState = () => {
  const uiState = useClaimUiState();
  const currentStep = useCurrentUiStep();
  const router = useRouter();
  const customerQuery = useCustomerStatus();
  const { data: isAuthenticated } = useAuthenticate();
  const chainId = useChainId();
  const debug = router.query.debug === "true";
  const claimMutation = useClaimMutation();
  const isClaimed = useIsClaimed();
  const openWidget = useOpenWidget();

  if (!debug) return null;

  return (
    <pre className="text- m-auto text-left">
      {JSON.stringify(
        {
          chainId,
          currentStep,
          uiState,
          isAuthenticated,
          customerQuery,
          claimMutation,
          isClaimed,
          openWidget,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (key: string, value: any): any => {
          if (typeof value === "bigint") {
            return value.toString() + "n";
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return value;
        },
        2,
      )}
    </pre>
  );
};

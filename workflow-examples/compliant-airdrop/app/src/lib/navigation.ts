import { useRouter } from "next/router";
import { useCallback } from "react";
import { type Address } from "viem";
import { useIsDebugMode } from "./useIsDebugMode";

export const useRedirectToClaimSuccess = () => {
  const router = useRouter();
  const isDebugMode = useIsDebugMode();

  return useCallback(
    (address: Address) => {
      void router.push({
        pathname: "/[address]/success",
        query: isDebugMode ? { address, debug: true } : { address },
      });
    },
    [router, isDebugMode],
  );
};

export const useRedirectToClaimError = () => {
  const router = useRouter();
  const isDebugMode = useIsDebugMode();

  return useCallback(
    (address: Address, error: string) => {
      void router.push({
        pathname: "/[address]/error",
        query: isDebugMode
          ? { address, error, debug: true }
          : { address, error },
      });
    },
    [router, isDebugMode],
  );
};

export const useRedirectToCheckWallet = () => {
  const router = useRouter();
  const isDebugMode = useIsDebugMode();

  return useCallback(
    (address: Address) => {
      void router.push({
        pathname: "/[address]/check",
        query: isDebugMode ? { address, debug: true } : { address },
      });
    },
    [router, isDebugMode],
  );
};

export const useRedirectToHome = () => {
  const router = useRouter();
  const isDebugMode = useIsDebugMode();

  return useCallback(() => {
    void router.push({
      pathname: "/",
      query: isDebugMode ? { debug: true } : {},
    });
  }, [router, isDebugMode]);
};

export const useRedirectToAccountPage = () => {
  const router = useRouter();
  const isDebugMode = useIsDebugMode();

  return useCallback(() => {
    void router.push({
      pathname: "/account",
      query: isDebugMode ? { debug: true } : {},
    });
  }, [router, isDebugMode]);
};

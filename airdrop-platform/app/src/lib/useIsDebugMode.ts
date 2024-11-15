import { useRouter } from "next/router";

export const useIsDebugMode = () => {
  const router = useRouter();

  return router.query.debug === "true";
};

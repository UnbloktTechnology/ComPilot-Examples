import { createAuthAdapter, createConfig } from "@compilot/react-sdk";
import "@/features/root/configureReactDemoEnv";
import { useAuthStore } from "./useKybWithoutWalletAuthentication";

export const compilotConfig = createConfig({
  authAdapter: createAuthAdapter({
    // This is a fake implementation of the auth adapter
    createSession: async () => {
      const authState = useAuthStore.getState();
      if (!authState.isAuthenticated || !authState.userId) {
        throw new Error("User is not authenticated");
      }
      const session = await fetch("/api/landing-kyb-not-wallet/access-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authState.userId,
        }),
      });

      return session.json();
    },
  }),
});

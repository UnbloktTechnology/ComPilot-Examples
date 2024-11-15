import { createAuthAdapter, createConfig } from "@compilot/react-sdk";
import { useMockKybAuthStore } from "./useMockBankKybAuth";

import "@/features/root/configureReactDemoEnv";

export const compilotConfig = createConfig({
  authAdapter: createAuthAdapter({
    // This is a fake implementation of the auth adapter
    createSession: async () => {
      const authState = useMockKybAuthStore.getState();
      if (!authState.isAuthenticated || !authState.user) {
        throw new Error("User is not authenticated");
      }

      const session = await fetch("/api/bank-kyb/access-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authState.user.id,
        }),
      });

      return session.json();
    },
  }),
});

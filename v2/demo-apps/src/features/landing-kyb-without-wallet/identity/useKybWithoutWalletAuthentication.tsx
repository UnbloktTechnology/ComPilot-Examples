import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { fetchAccessToken } from "./fetchAccessToken";

export const useMockKybWithoutWallet = () => {
  const authStore = useAuthStore((state) => state);

  const logout = useMutation({
    mutationFn: async () => {
      await Promise.resolve(authStore.logout());
    },
  });

  const authenticate = useMutation({
    mutationFn: async (variables: { userId: string }) => {
      const response = await fetchAccessToken({
        userId: variables.userId,
      });
      const { accessToken } = response;
      return {
        accessToken,
        testUser: variables.userId,
      };
    },
    onSuccess: (data) => {
      authStore.authenticate(data.accessToken, data.testUser);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    authenticate,
    logout,
    accessToken: authStore.accessToken,
    isAuthenticated: authStore.isAuthenticated,
    isIdentityClientInit: authStore.isIdentityClientInit,
    setIsIdentityClientInit: authStore.setIsIdentityClientInit,
    userId: authStore.userId,
  };
};

interface IAuthStore {
  accessToken?: string;
  isAuthenticated: boolean;
  userId?: string;
  isIdentityClientInit: boolean;
  setIsIdentityClientInit: (isInit: boolean) => void;
  authenticate: (accessToken: string, userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        accessToken: undefined,
        isAuthenticated: false,
        isIdentityClientInit: false,
        setIsIdentityClientInit: (isInit: boolean) => {
          set((state) => {
            state.isIdentityClientInit = isInit;
          });
        },
        authenticate: (accessToken: string, userId: string) => {
          set((state) => {
            state.accessToken = accessToken;
            state.isAuthenticated = true;
            state.userId = userId;
          });
        },
        logout: () => {
          set((state) => {
            state.accessToken = undefined;
            state.isAuthenticated = false;
            state.userId = undefined;
          });
        },
      })),
      {
        name: "kyb-without-wallet",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

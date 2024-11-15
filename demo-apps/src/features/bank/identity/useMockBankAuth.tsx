import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { TestUser } from "@/appConfig";

export const useMockBankAuth = () => {
  const authStore = useMockAuthStore((state) => state);

  const logout = useMutation({
    mutationFn: async () => {
      await Promise.resolve(authStore.logout());
    },
  });

  const authenticate = useMutation({
    mutationFn: async (variables: { user: TestUser }) => {
      return {
        testUser: variables.user,
      };
    },
    onSuccess: (data) => {
      authStore.authenticate(data.testUser);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    authenticate,
    logout,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
  };
};

interface IAuthStore {
  isAuthenticated: boolean;
  user?: TestUser;
  authenticate: (user: TestUser) => void;
  logout: () => void;
}

export const useMockAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        isAuthenticated: false,
        authenticate: (user: TestUser) => {
          set((state) => {
            state.isAuthenticated = true;
            state.user = user;
          });
        },
        logout: () => {
          set((state) => {
            state.isAuthenticated = false;
            state.user = undefined;
          });
        },
      })),
      {
        name: "bank",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

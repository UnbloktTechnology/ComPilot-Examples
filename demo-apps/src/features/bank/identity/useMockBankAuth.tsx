import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useMockBankAuth = () => {
  const authStore = useMockAuthStore((state) => state);

  const logout = useMutation({
    mutationFn: async () => {
      await Promise.resolve(authStore.logout());
    },
  });

  const authenticate = useMutation({
    mutationFn: async (variables: { user: AliceForWeb2Auth }) => {
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

export interface AliceForWeb2Auth {
  readonly id: string;
  readonly name: "Alice";
  readonly avatar: "alice-user";
}

interface IAuthStore {
  isAuthenticated: boolean;
  user?: AliceForWeb2Auth;
  authenticate: (user: AliceForWeb2Auth) => void;
  logout: () => void;
}

export const useMockAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        isAuthenticated: false,
        authenticate: (user: AliceForWeb2Auth) => {
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

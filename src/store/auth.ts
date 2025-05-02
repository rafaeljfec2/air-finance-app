import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "@/types";

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      login: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () => set(initialState),
    }),
    {
      name: "auth-storage",
    },
  ),
);

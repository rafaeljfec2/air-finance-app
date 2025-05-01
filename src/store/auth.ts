import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types";

interface AuthStore extends AuthState {
  login: (usuario: AuthState["usuario"], token: string) => void;
  logout: () => void;
}

const initialState: AuthState = {
  usuario: null,
  token: null,
  isAutenticado: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      login: (usuario, token) =>
        set({
          usuario,
          token,
          isAutenticado: true,
        }),
      logout: () => set(initialState),
    }),
    {
      name: "auth-storage",
    },
  ),
);

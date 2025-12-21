import { create } from "zustand";

import type { TAuthState } from "./auth.types";

export const useAuthStore = create<TAuthState>((set) => {
  return {
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
    logout: () => set({ user: null, isAuthenticated: false }),
  };
});

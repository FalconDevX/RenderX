  import { create } from "zustand";
  import { loginUser, registerUser, refreshUserToken, logoutUser } from "./auth.api";

  interface User {
    username: string;
    email: string;
  }

  interface AuthState {
    user: User | null;
    accessToken: string | null;
    isInitialized: boolean; 
    register: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
  }

  export const useAuth = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isInitialized: false, 

    register: async (username, email, password) => {
      await registerUser(username, email, password);
    },

    login: async (email, password) => {
      const res = await loginUser(email, password);
      const { access, user } = res.data;
      set({ accessToken: access, user, isInitialized: true }); 
    },

    logout: async () => {
        await logoutUser()
        set({ user: null, accessToken: null, isInitialized: true });
    },

    refresh: async () => {
      try {
        const res = await refreshUserToken();
        const { access, user } = res.data;
        set({ accessToken: access, user, isInitialized: true }); 
      } catch {
        set({ user: null, accessToken: null, isInitialized: true }); 
      }
    },
  }));
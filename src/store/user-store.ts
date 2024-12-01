import { WritableDraft } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type UserInfo = {
  email: string;
  name: string;
  photoUrl: string;
  accessToken: string;
};

type Store = {
  user?: UserInfo;
  isLoading: boolean;
  error?: string;
  setUser: (user?: UserInfo) => void;
  setError: (error?: string) => void;
  setLoading: (value: boolean) => void;
};

export const useUserStore = create<Store>()(
  immer((set, get) => ({
    isLoading: false,
    setUser(user) {
      set((d) => {
        d.user = user;
      });
    },
    setError(error) {
      set((d) => {
        d.error = error;
      });
    },
    setLoading(value) {
      set((d) => {
        d.isLoading = value;
      });
    },
  }))
);

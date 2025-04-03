import { create } from 'zustand';

interface UserStore {
  accessToken: string;
  isParent: boolean;
  hasAccountConnected: boolean;

  setAccessToken: (accessToken: string) => void;
  setIsParent: (isParent: boolean) => void;
  setHasAccountConnected: (hasAccountConnected: boolean) => void;

  resetUserStore: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  accessToken: 'VALUE',
  isParent: false,
  hasAccountConnected: false,

  setAccessToken: (accessToken) => set({ accessToken }),
  setIsParent: (isParent) => set({ isParent }),
  setHasAccountConnected: (hasAccountConnected) => set({ hasAccountConnected }),

  resetUserStore: () =>
    set({
      accessToken: 'VALUE',
      isParent: false,
      hasAccountConnected: false,
    }),
}));

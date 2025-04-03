import { create } from 'zustand';

interface UserStore {
  userId: number;
  userName: string;

  accessToken: string;
  isParent: boolean;
  hasAccountConnected: boolean;

  setAccessToken: (accessToken: string) => void;
  setIsParent: (isParent: boolean) => void;
  setHasAccountConnected: (hasAccountConnected: boolean) => void;

  resetUserStore: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: 1,
  userName: 'child',

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

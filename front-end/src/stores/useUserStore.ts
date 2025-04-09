import { User } from '@/types/user';
import { create } from 'zustand';

interface UserStore {
  user: User | undefined;

  accessToken: string;
  hasAccountConnected: boolean;

  setUser: (user: User) => void;
  getIsParent: () => boolean;

  setAccessToken: (accessToken: string) => void;
  setHasAccountConnected: (hasAccountConnected: boolean) => void;

  resetUserStore: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: undefined,

  accessToken: 'VALUE',
  hasAccountConnected: false,

  setUser: (user: User) => set({ user }),
  getIsParent: () => {
    return get().user?.type === 'PARENT';
  },

  setAccessToken: (accessToken) => set({ accessToken }),
  setHasAccountConnected: (hasAccountConnected) => set({ hasAccountConnected }),

  resetUserStore: () =>
    set({
      accessToken: 'VALUE',
      hasAccountConnected: false,
      user: undefined,
    }),
}));

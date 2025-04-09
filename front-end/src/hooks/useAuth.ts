import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import useGetUserInfo from './query/useGetUserInfo';
import { authBridge } from '@/apis/authBridge';
import { useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { accessToken, user, setUser } = useUserStore();
  const getIsParent = useUserStore((state) => state.getIsParent);
  const { data: userInfo, isLoading, error } = useGetUserInfo();

  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const isLoggedIn = Boolean(accessToken) && accessToken !== 'VALUE';

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo, setUser]);

  const requireAuth = () => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/signin');
      return false;
    }
    return true;
  };

  const logout = () => {
    authBridge.clearTokens();
    useUserStore.getState().resetUserStore();
    queryClient.clear();

    setIsLoggedOut(true);
  };

  const completeLogout = () => {
    setIsLoggedOut(false);
    router.push('/auth/signin');
  };

  return {
    isLoggedIn,
    isLoading,
    userInfo: user || userInfo,
    error,
    isParent: getIsParent(),
    requireAuth,
    logout,
    isLoggedOut,
    completeLogout,
  };
};

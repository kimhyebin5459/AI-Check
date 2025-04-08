import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import useGetUserInfo from './query/useGetUserInfo';

export const useAuth = () => {
  const router = useRouter();
  const { accessToken, user, setUser } = useUserStore();
  const getIsParent = useUserStore((state) => state.getIsParent);
  const { data: userInfo, isLoading, error } = useGetUserInfo();

  const isLoggedIn = Boolean(accessToken) && accessToken !== 'VALUE';

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo, setUser]);

  const requireAuth = () => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const logout = () => {
    useUserStore.getState().resetUserStore();
    router.push('/login');
  };

  return {
    isLoggedIn,
    isLoading,
    userInfo: user || userInfo,
    error,
    isParent: getIsParent(),
    requireAuth,
    logout,
  };
};

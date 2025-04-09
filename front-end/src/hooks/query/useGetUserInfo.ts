import { getUserInfo } from '@/apis/user';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useUserStore } from '@/stores/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const useGetUserInfo = () => {
  const setUser = useUserStore((state) => state.setUser);

  const query = useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: getUserInfo,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
};

export default useGetUserInfo;

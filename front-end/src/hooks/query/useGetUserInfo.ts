import { getUserInfo } from '@/apis/user';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetUserInfo = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: getUserInfo,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetUserInfo;

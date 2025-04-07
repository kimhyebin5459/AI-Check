import { getMyAccount } from '@/apis/account';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetMyAccount = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MY_ACCOUNT],
    queryFn: getMyAccount,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetMyAccount;

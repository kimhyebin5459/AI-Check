import { getMemoRate } from '@/apis/account';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetMemoRate = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MEMO_RATE],
    queryFn: () => getMemoRate(),
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetMemoRate;

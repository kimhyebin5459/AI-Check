import { getRegularTransferList } from '@/apis/regularTransfer';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetRegularTransferList = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.REGULAR_LIST],
    queryFn: getRegularTransferList,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetRegularTransferList;

import { getRequestList } from '@/apis/request';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetRequestList = (enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REQUEST_LIST],
    queryFn: getRequestList,
    enabled,
  });
};

export default useGetRequestList;

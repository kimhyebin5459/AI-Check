import { getIncreaseRequest } from '@/apis/request';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetIncreaseRequest = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INCREASE_REQUEST, id],
    queryFn: () => getIncreaseRequest(id),
  });
};

export default useGetIncreaseRequest;

import { getTransferRequest } from '@/apis/request';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetTransferRequest = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRANSFER_REQUEST, id],
    queryFn: () => getTransferRequest(id),
  });
};

export default useGetTransferRequest;

import { patchTransferRequest } from '@/apis/request';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { RequestPostForm } from '@/types/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const usePatchTransferRequest = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (request: RequestPostForm) => patchTransferRequest(request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSFER_REQUEST, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REQUEST_LIST],
      });
      router.refresh();
    },
  });
};

export default usePatchTransferRequest;

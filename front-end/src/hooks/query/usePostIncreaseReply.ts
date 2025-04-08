import { postIncreaseReply } from '@/apis/request';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { RequestPostForm } from '@/types/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const usePostIncreaseReply = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (request: RequestPostForm) => postIncreaseReply(request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INCREASE_REQUEST, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REQUEST_LIST],
      });
      router.refresh();
    },
  });
};

export default usePostIncreaseReply;

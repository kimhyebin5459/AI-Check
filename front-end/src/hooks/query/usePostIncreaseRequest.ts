import { postIncreaseRequest } from '@/apis/request';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const usePostIncreaseRequest = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: postIncreaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REQUEST_LIST],
      });
      router.push('/request');
    },
  });
};

export default usePostIncreaseRequest;

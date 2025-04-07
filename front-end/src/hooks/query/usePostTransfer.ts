import { postTransfer } from '@/apis/transfer';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const usePostTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MY_ACCOUNT],
      });
    },
  });
};

export default usePostTransfer;

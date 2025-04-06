import { deleteRegularTransfer } from '@/apis/regularTransfer';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const useDeleteRegularTransfer = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteRegularTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REGULAR_LIST],
      });
      router.refresh();
    },
  });
};

export default useDeleteRegularTransfer;

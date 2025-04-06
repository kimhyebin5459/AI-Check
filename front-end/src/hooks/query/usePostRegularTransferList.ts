import { postRegularTransfer } from '@/apis/regularTransfer';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const usePostRegularTransferList = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: postRegularTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REGULAR_LIST],
      });
      router.push('/regular-transfer');
    },
  });
};

export default usePostRegularTransferList;

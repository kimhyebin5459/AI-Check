import { postAccount } from '@/apis/account';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const usePostAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MY_ACCOUNT],
      });
    },
  });
};

export default usePostAccount;

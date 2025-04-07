import { patchUserInfo } from '@/apis/user';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const usePatchUserInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER],
      });
    },
  });
};

export default usePatchUserInfo;

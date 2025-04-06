import { patchRegularTransfer } from '@/apis/regularTransfer';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { SchedulePostForm } from '@/types/regularTransfer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface MutationVariables {
  scheduleId: number;
  schedule: SchedulePostForm;
}

const usePatchRegularTransferList = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ scheduleId, schedule }: MutationVariables) => patchRegularTransfer(scheduleId, schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REGULAR_LIST],
      });
      router.push('/regular-transfer');
    },
  });
};

export default usePatchRegularTransferList;

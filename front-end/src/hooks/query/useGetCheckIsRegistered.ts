import { getCheckIsRegistered } from '@/apis/regularTransfer';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetCheckIsRegistered = (reportId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHECK_REPORT_REGISTERED, reportId],
    queryFn: () => getCheckIsRegistered(reportId),
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export default useGetCheckIsRegistered;

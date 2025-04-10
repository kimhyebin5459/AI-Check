import { getSummary } from '@/apis/request';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetSummary = (childId: number, reportId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUMMARY, childId, reportId],
    queryFn: () => getSummary(childId, reportId),
    // staleTime: 1000 * 60 * 60 * 24,
  });
};

export default useGetSummary;

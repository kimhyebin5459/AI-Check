import { getPeerReport } from '@/apis/report';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetPeerReport = (year: number, month: number, childId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_REPORT, year, month, childId],
    queryFn: () => getPeerReport(year, month, childId),
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export default useGetPeerReport;

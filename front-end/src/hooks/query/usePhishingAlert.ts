import { useQuery } from '@tanstack/react-query';
import { getPhishingAlerts } from '@/apis/phishing';
import { PhishingAlert } from '@/types/phishing';

const usePhishingAlerts = () => {
  return useQuery<PhishingAlert[]>({
    queryKey: ['phishingAlerts'],
    queryFn: getPhishingAlerts,
    staleTime: 30 * 1000,
    retry: 1,
  });
};

export default usePhishingAlerts;

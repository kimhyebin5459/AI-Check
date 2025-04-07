import fetcher from './fetcher';
import { PhishingAlert, PhishingStats } from '@/types/phishing';

export const getPhishing = async (): Promise<PhishingStats> => {
  return await fetcher.get({ url: `aicheck/phishings` });
};

export const getPhishingAlerts = async (): Promise<PhishingAlert[]> => {
  return await fetcher.get({ url: `aicheck/phishings/family` });
};

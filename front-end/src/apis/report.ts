import fetcher from '@/apis/fetcher';
import { CategoryReportResponse, PeerReportResponse } from '@/types/report';

export const getCategoryReport = async (
  year: number,
  month: number,
  childId: number
): Promise<CategoryReportResponse> => {
  return await fetcher.get({ url: `aicheck/reports?${year}&${month}&${childId}` });
};

export const getMyCategoryReport = async (year: number, month: number): Promise<CategoryReportResponse> => {
  return await fetcher.get({ url: `aicheck/reports/my?${year}&${month}` });
};

export const getPeerReport = async (year: number, month: number, childId: number): Promise<PeerReportResponse> => {
  return await fetcher.get({ url: `aicheck/reports/peer?${year}&${month}&${childId}` });
};

export const getMyPeerReport = async (year: number, month: number): Promise<PeerReportResponse> => {
  return await fetcher.get({ url: `aicheck/reports/peer/my?${year}&${month}` });
};

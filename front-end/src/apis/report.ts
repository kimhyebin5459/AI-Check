import fetcher from '@/apis/fetcher';
import { CategoryReportResponse, PeerReportResponse } from '@/types/report';

export const getCategoryReport = async (
  year: number,
  month: number,
  childId: number
): Promise<CategoryReportResponse> => {
  return await fetcher.get({ url: `batch/reports?year=${year}&month=${month}&childId=${childId}` });
};

export const getMyCategoryReport = async (year: number, month: number): Promise<CategoryReportResponse> => {
  return await fetcher.get({ url: `batch/reports/my?year=${year}&month=${month}` });
};

export const getPeerReport = async (year: number, month: number, childId: number): Promise<PeerReportResponse> => {
  return await fetcher.get({ url: `batch/reports/peer?year=${year}&month=${month}&childId=${childId}` });
};

export const getMyPeerReport = async (year: number, month: number): Promise<PeerReportResponse> => {
  return await fetcher.get({ url: `batch/reports/peer/my?year=${year}&month=${month}` });
};

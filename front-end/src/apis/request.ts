import fetcher from '@/apis/fetcher';
import { IncreasePostForm, IncreaseRequest, RequestPostForm, Summary, TransferRequest } from '@/types/request';

export const getRequestList = async () => {
  const response = await fetcher.get({ url: 'aicheck/allowance' });
  return response as TransferRequest[];
};

export const patchTransferRequest = async (request: RequestPostForm) => {
  return await fetcher.patch({ url: 'aicheck/allowance', body: request });
};

export const getTransferRequest = async (id: number): Promise<TransferRequest> => {
  return await fetcher.get({ url: `aicheck/allowance/detail/${id}` });
};

export const postIncreaseRequest = async (request: IncreasePostForm) => {
  return await fetcher.post({ url: 'aicheck/allowance/increase', body: request });
};

export const postIncreaseReply = async ({ id, status }: RequestPostForm) => {
  return await fetcher.post({ url: `aicheck/allowance/increase/${id}`, body: { status } });
};

export const getIncreaseRequest = async (id: number): Promise<IncreaseRequest> => {
  return await fetcher.get({ url: `aicheck/allowance/increase/details/${id}` });
};

export const getSummary = async (childId: number, reportId: string): Promise<Summary> => {
  const response = await fetcher.get({ url: `aicheck/allowance/summary?childId=${childId}&reportId=${reportId}` });
  return response;
};

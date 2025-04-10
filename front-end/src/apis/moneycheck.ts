import {
  TransactionReq,
  TransactionGroup,
  Transaction,
  UpdateTransactionData,
  UpdateRatingData,
} from '@/types/transaction';
import { CalendarResponse } from '@/types/calendar';
import fetcher from '@/apis/fetcher';

export const getTransactionHistory = async ({
  childId,
  startDate,
  endDate,
  type,
}: TransactionReq): Promise<TransactionGroup[]> => {
  const baseUrl = childId ? `aicheck/transaction-records/child/${childId}` : `aicheck/transaction-records`;

  const response = await fetcher.get({
    url: `${baseUrl}?` + `startDate=${startDate}&endDate=${endDate}` + (type !== 'ALL' ? `&type=${type}` : ``),
  });
  const data = response.data;
  return data;
};

export const getCalendar = async (year: number, month: number): Promise<CalendarResponse> => {
  const response = await fetcher.get({
    url: `aicheck/transaction-records/calendar?year=${year}&month=${month}`,
  });
  const data = response;
  return data;
};

export const getDetail = async (recordId: number): Promise<Transaction> => {
  const response = await fetcher.get({ url: `aicheck/transaction-records/${recordId}` });
  const data = response;
  return data;
};

export const updateTransactionRecord = async (updateData: UpdateTransactionData) => {
  return await fetcher.patch({ url: 'aicheck/transaction-records', body: updateData });
};

export const updateRating = async (updateData: UpdateRatingData) => {
  return await fetcher.post({ url: 'aicheck/transaction-records/rating', body: updateData });
};

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
  const baseUrl = childId ? `aicheck/transaction-records/child` : `aicheck/transaction-records`;

  const response = await fetcher.get({
    url:
      `${baseUrl}?` +
      (childId ? `childId=${childId}&` : ``) +
      `startDate=${startDate}&endDate=${endDate}` +
      (type !== 'ALL' ? `&type=${type}` : ``),
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
  console.log(updateData);

  return await fetcher.patch({ url: 'aicheck/transaction-records', body: updateData });
};

export const updateRating = async (updateData: UpdateRatingData) => {
  return await fetcher.patch({ url: 'aicheck/transaction-records', body: updateData });
};

// export const 함수이름 = async (변수명: 타입명, 변수명: 타입명): Promise<리턴타입> => {
//   const response = await fetcher.get({ url: '주소' });
//   const data = await response.json(); //바디에서 제이슨 까야하면
//   return data;
// };

// export const 함수이름 = async ({ 변수명1, 변수명2, 변수명3 }: 모두묶인타입명) => Promise<리턴타입> {
//   return await fetcher.post({ url: `aicheck/auth/signin?어쩌구=${변수명3}`, body: { 변수명1, 변수명2 } });
// };

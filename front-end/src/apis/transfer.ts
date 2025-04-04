import fetcher from '@/apis/fetcher';
import { TransferPostForm } from '@/types/transfer';

export const getAccountConfirm = async (accountNo: number) => {
  const response = await fetcher.get({ url: `aicheck/transfer/${accountNo}` });
  return response;
};

export const postTransfer = async ({ receiverAccountNo, amount }: TransferPostForm) => {
  return await fetcher.post({ url: 'aicheck/transfer', body: { receiverAccountNo, amount } });
};

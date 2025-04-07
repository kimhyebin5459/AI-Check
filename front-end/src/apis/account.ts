import fetcher from '@/apis/fetcher';
import { Account, ChildAccount, Memo } from '@/types/account';

export const getMyAccount = async (): Promise<Account> => {
  return await fetcher.get({ url: 'aicheck/accounts/my' });
};

export const getMyAccountList = async (): Promise<Account[]> => {
  return await fetcher.get({ url: 'aicheck/accounts' });
};

export const postAccount = async (accountId: number) => {
  return await fetcher.post({ url: 'aicheck/accounts', body: { accountId } });
};

export const postPasswordConfirm = async ({ accountId, password }: { accountId: number; password: string }) => {
  return await fetcher.post({ url: 'aicheck/accounts/check', body: { accountId, password } });
};

export const getChildAccount = async (childId: number): Promise<Account> => {
  return await fetcher.get({ url: `aicheck/accounts/${childId}` });
};

export const getChildAccountList = async () => {
  const response = await fetcher.get({ url: 'aicheck/accounts/children' });
  return response.accounts as ChildAccount[];
};

export const getMemoRate = async (): Promise<Memo> => {
  return await fetcher.get({ url: 'aicheck/accounts/description-ratio' });
};

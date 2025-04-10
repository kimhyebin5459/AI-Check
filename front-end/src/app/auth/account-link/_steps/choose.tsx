'use client';

import { useEffect, useState } from 'react';
import AccountCard from '@/components/auth/AccountCard';
import { Account } from '@/types/account';
import Spinner from '@/components/common/Spinner';
import { getMyAccountList } from '@/apis/account';

type Props = {
  onNext: (account: Account) => void;
  setAccounts: (accounts: Account[]) => void;
  cachedAccounts?: Account[];
};

export default function Choose({ onNext, setAccounts, cachedAccounts = [] }: Props) {
  const [accounts, setLocalAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedAccounts.length > 0) {
      setLocalAccounts(cachedAccounts);
      setIsLoading(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const accountsData = await getMyAccountList();
        setLocalAccounts(accountsData);
        setAccounts(accountsData);
      } catch (_err) {
        setError('계좌 목록을 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [cachedAccounts, setAccounts]);

  const handleSelectAccount = (account: Account, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onNext(account);
  };

  if (isLoading) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-500">
          연동 가능한 계좌가 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="mr-5 mb-16 ml-5 flex flex-grow flex-col justify-center">
      <h1 className="text-mdl mb-5 font-bold">
        연동할 계좌를
        <br />
        선택해주세요
      </h1>

      <div className="space-y-4">
        {accounts.map((account) => (
          <AccountCard key={account.accountId} account={account} onSelect={handleSelectAccount} />
        ))}
      </div>
    </div>
  );
}

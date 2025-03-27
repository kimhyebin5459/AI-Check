"use client";

import { useEffect, useState } from 'react';
import AccountCard from '@/components/auth/AccountCard';

type AccountType = {
  id: string;
  accountNumber: string;
  bankName: string;
};

type Props = {
  onNext: (account: AccountType) => void;
  setAccounts: (accounts: AccountType[]) => void;
  cachedAccounts?: AccountType[];
};

export default function Choose({ onNext, setAccounts, cachedAccounts = [] }: Props) {
  const [accounts, setLocalAccounts] = useState<AccountType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cachedAccounts.length > 0) {
      setLocalAccounts(cachedAccounts);
      setIsLoading(false);
      return;
    }

    const mockAccounts = [
      { id: '1', bankName: 'OO은행', accountNumber: '123-456789-12' },
      { id: '2', bankName: 'OO은행', accountNumber: '123-456789-12' },
      { id: '3', bankName: 'OO은행', accountNumber: '123-456789-12' },
    ];

    setTimeout(() => {
      setLocalAccounts(mockAccounts);
      setAccounts(mockAccounts);
      setIsLoading(false);
    }, 500);
  }, [cachedAccounts, setAccounts]);

  const handleSelectAccount = (account: AccountType, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onNext(account);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow">
        <p>계좌 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow ml-5 mr-5 justify-center mb-16">
      <h1 className="text-mdl font-bold mb-5">
        연동할 계좌를<br />
        선택해주세요
      </h1>

      <div className="space-y-4">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onSelect={handleSelectAccount}
          />
        ))}
      </div>
    </div>
  );
}
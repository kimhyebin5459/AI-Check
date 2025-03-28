'use client';

import { useEffect, useState } from 'react';
import AccountCard from '@/components/auth/AccountCard';
import { Account } from '@/types/common/account';

type Props = {
  onNext: (account: Account) => void;
  setAccounts: (accounts: Account[]) => void;
  cachedAccounts?: Account[];
};

export default function Choose({ onNext, setAccounts, cachedAccounts = [] }: Props) {
  const [accounts, setLocalAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cachedAccounts.length > 0) {
      setLocalAccounts(cachedAccounts);
      setIsLoading(false);
      return;
    }

    const mockAccounts = [
      { accountId: 1, accountName: 'OO은행 계좌', accountNo: '123-456789-12' },
      { accountId: 2, accountName: 'OO은행 계좌', accountNo: '123-456789-12' },
      { accountId: 3, accountName: 'OO은행 계좌', accountNo: '123-456789-12' },
    ];

    setTimeout(() => {
      setLocalAccounts(mockAccounts);
      setAccounts(mockAccounts);
      setIsLoading(false);
    }, 500);
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
        <p>계좌 정보를 불러오는 중...</p>
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

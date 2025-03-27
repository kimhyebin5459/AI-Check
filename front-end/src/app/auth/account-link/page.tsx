'use client';

import { useState } from 'react';
import Choose from './_steps/choose';
import Confirm from './_steps/confirm';
import CheckPassword from './_steps/check-password';
import NoticePage from '@/components/common/NoticePage';
import { useRouter } from 'next/navigation';

type AccountType = {
  id: string;
  accountNumber: string;
  bankName: string;
};

const steps = ['choose', 'confirm', 'check-password', 'success'];

export default function Page() {
  const [stepLevel, setStepLevel] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState<AccountType | undefined>();
  const [accountList, setAccountList] = useState<AccountType[]>([]);

  const router = useRouter();

  const onNext = (account?: AccountType) => {
    if (account) {
      setSelectedAccount(account);
    }
    setStepLevel((prev) => prev + 1);
  };

  const onPrev = () => {
    setStepLevel((prev) => prev - 1);
  };

  const setAccounts = (accounts: AccountType[]) => {
    setAccountList(accounts);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-grow flex-col">
        {steps[stepLevel] === 'choose' && (
          <Choose onNext={onNext} setAccounts={setAccounts} cachedAccounts={accountList} />
        )}
        {steps[stepLevel] === 'confirm' && <Confirm account={selectedAccount} onNext={onNext} onPrev={onPrev} />}
        {steps[stepLevel] === 'check-password' && (
          <CheckPassword account={selectedAccount} onNext={onNext} onPrev={onPrev} />
        )}
        {steps[stepLevel] === 'success' && (
          <NoticePage
            title="성공"
            message="계좌 연동이 완료되었습니다."
            buttonText="확인"
            onButtonClick={() => {
              router.replace("/")
            }}
          />
        )}
      </main>
    </div>
  );
}

'use client';

const steps = ['account', 'amount', 'confirm', 'success'];

import { useState } from 'react';
import Account from './_steps/account';
import Amount from './_steps/amount';
import Confirm from './_steps/confirm';
import { Transfer } from '@/types/transfer';
import { account } from '@/mocks/fixtures/account';
import NoticePage from '@/components/common/NoticePage';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const [stepLevel, setStepLevel] = useState<number>(0);
  const [transferInfo, setTransferInfo] = useState<Transfer>({
    name: 'default',
    image: 'default',
    accountNo: 'default',
    amount: 0,
  });
  const myAccount = account;

  const onNext = (transferInfo?: Transfer) => {
    if (transferInfo) {
      setTransferInfo(transferInfo);
    }
    setStepLevel((prev) => prev + 1);
  };

  const onPrev = () => {
    setStepLevel((prev) => prev - 1);
  };

  return (
    <div>
      {steps[stepLevel] === 'account' && <Account onNext={onNext} />}
      {steps[stepLevel] === 'amount' && (
        <Amount transferInfo={transferInfo} myAccount={myAccount} onNext={onNext} onPrev={onPrev} />
      )}
      {steps[stepLevel] === 'confirm' && (
        <Confirm transferInfo={transferInfo} myAccount={myAccount} onNext={onNext} onPrev={onPrev} />
      )}
      {steps[stepLevel] === 'success' && (
        <NoticePage
          title="성공"
          message="송금이 완료되었습니다."
          buttonText="확인"
          onButtonClick={() => {
            router.replace('/money-check');
          }}
        />
      )}
    </div>
  );
}

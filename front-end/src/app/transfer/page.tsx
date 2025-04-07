'use client';

const steps = ['account', 'amount', 'confirm', 'success'];

import { useState } from 'react';
import Account from './_steps/account';
import Amount from './_steps/amount';
import Confirm from './_steps/confirm';
import { Transfer } from '@/types/transfer';
import NoticePage from '@/components/common/NoticePage';
import { useRouter } from 'next/navigation';
import useGetMyAccount from '@/hooks/query/useGetMyAccount';
import usePostTransfer from '@/hooks/query/usePostTransfer';
import LoadingComponent from '@/app/_components/loading-component';

export default function Page() {
  const router = useRouter();

  const [stepLevel, setStepLevel] = useState<number>(0);
  const [transferInfo, setTransferInfo] = useState<Transfer>({
    name: 'default',
    image: 'default',
    accountNo: 'default',
    amount: 0,
  });
  const { data: myAccount } = useGetMyAccount();
  const { mutate: createTransfer, isPending } = usePostTransfer();

  const onNext = (transferInfo?: Transfer) => {
    if (transferInfo) {
      setTransferInfo(transferInfo);
    }
    setStepLevel((prev) => prev + 1);
  };

  const onPrev = () => {
    setStepLevel((prev) => prev - 1);
  };

  if (isPending) return <LoadingComponent />;

  return (
    <div>
      {steps[stepLevel] === 'account' && <Account onNext={onNext} />}
      {steps[stepLevel] === 'amount' && myAccount && (
        <Amount transferInfo={transferInfo} myAccount={myAccount} onNext={onNext} onPrev={onPrev} />
      )}
      {steps[stepLevel] === 'confirm' && myAccount && (
        <Confirm
          transferInfo={transferInfo}
          myAccount={myAccount}
          onNext={onNext}
          onPrev={onPrev}
          onCreateTransfer={createTransfer}
        />
      )}
      {steps[stepLevel] === 'success' && (
        <NoticePage
          title="성공"
          message="송금이 완료되었습니다."
          buttonText="확인"
          onButtonClick={() => {
            router.replace('/');
          }}
        />
      )}
    </div>
  );
}

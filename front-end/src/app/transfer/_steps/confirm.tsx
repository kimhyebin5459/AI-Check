'use client';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import ProfileImage from '@/components/common/ProfileImage';
import { Account } from '@/types/account';
import { Transfer } from '@/types/transfer';
import { formatMoney } from '@/utils/formatMoney';
import { useEffect } from 'react';

type Props = {
  transferInfo: Transfer;
  myAccount: Account;
  onNext: () => void;
  onPrev: () => void;
};

export default function Confirm({ transferInfo, myAccount, onNext, onPrev }: Props) {
  const { accountName, accountNo, balance } = myAccount;
  const { name, image, amount } = transferInfo;

  useEffect(() => {
    window.history.pushState({ page: 'confirm' }, '');

    const handlePopState = (event: Event) => {
      event.preventDefault();
      onPrev();
      window.history.pushState({ page: 'confirm' }, '');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onPrev]);

  const handleClick = () => {
    console.log(transferInfo.accountNo, amount);
    onNext();
  };

  return (
    <div className="container space-y-5 px-5">
      <Header hasBackButton hasBorder={false} />
      <div className="flex w-full flex-col items-center space-y-6 pt-14">
        <ProfileImage image={image} size="xl" />
        <div className="text-center text-2xl font-bold">
          <p>{name} 에게</p>
          <p>{formatMoney(amount)}을 보낼까요?</p>
        </div>

        <div className="w-full space-y-2 rounded-xl border border-gray-200 px-4 py-2 font-semibold">
          <div className="flex justify-between">
            <p>출금 계좌</p>
            <p className="text-gray-600">
              {accountName} {accountNo}
            </p>
          </div>
          <div className="border-[0.03rem] border-gray-200"></div>
          <div className="flex justify-between">
            <p>출금 후 잔액 </p>
            <div className="flex items-center space-x-1">
              <p className="text-sm font-light text-gray-600">{formatMoney(Number(balance))} →</p>
              <p>{formatMoney(Number(balance) - amount)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-btn">
        <Button onClick={handleClick}>보내기</Button>
      </div>
    </div>
  );
}

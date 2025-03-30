'use client';

import Header from '@/components/common/Header';
import NumberKeypad from '@/components/common/NumberKeypad';
import Tag from '@/components/common/Tag';
import { MONEY_UNIT } from '@/constants/moneyUnit';
import { Arrow } from '@/public/icons';
import { Account } from '@/types/account';
import { Transfer } from '@/types/transfer';
import { formatMoney } from '@/utils/formatMoney';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  transferInfo: Transfer;
  myAccount: Account;
  onNext: (transferInfo: Transfer) => void;
  onPrev: () => void;
};

export default function Amount({ transferInfo, myAccount, onNext, onPrev }: Props) {
  const [amount, setAmount] = useState(0);

  const { accountName, accountNo, balance } = myAccount;

  useEffect(() => {
    window.history.pushState({ page: 'amount' }, '');

    const handlePopState = (event: Event) => {
      event.preventDefault();
      onPrev();
      window.history.pushState({ page: 'amount' }, '');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onPrev]);

  useEffect(() => {
    if (balance && amount > balance) {
      setAmount(balance);
    }
  }, [amount]);

  const handleNumberPlus = (num: number) => {
    setAmount(amount + num);
  };

  const handleNumberClick = (num: number) => {
    setAmount(amount * 10 + num);
  };

  const handleBackspace = () => {
    if (amount > 0) {
      setAmount(Math.floor(amount / 10));
    }
  };

  const handleSubmit = () => {
    onNext({ ...transferInfo, amount: amount });
  };

  return (
    <div className="container min-h-screen justify-between px-5">
      <Header hasBackButton hasBorder={false} />
      <div className="h-full w-full pt-8">
        <div className="space-y-2">
          <div>
            <p className="font-bold">{transferInfo.name} 님께</p>
            <p className="font-thin text-gray-800">{transferInfo.accountNo}</p>
          </div>
          <p className="text-mdl font-bold">얼마를 보낼까요?</p>
        </div>
      </div>
      <p
        className={`flex min-h-9 items-center justify-center font-semibold ${!amount ? 'text-xl text-gray-400' : 'text-2xl'}`}
      >
        {!amount ? '금액을 입력하세요' : formatMoney(amount)}
      </p>
      <div className="w-full space-y-4">
        <div className="flex justify-between rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800">
          <div className="flex space-x-2">
            <p>{accountName}</p>
            <p>{accountNo}</p>
          </div>
          <div className="flex items-center space-x-1">
            <p>{formatMoney(Number(balance))}</p>
            <Image src={Arrow} alt="arrow icon" className="hidden size-5 rotate-180" />
          </div>
        </div>
        <div className="flex space-x-2 pb-4">
          {Object.keys(MONEY_UNIT).map((unit) => (
            <Tag isSelected size="xs" onClick={() => handleNumberPlus(MONEY_UNIT[unit])} key={unit}>
              +{unit}
            </Tag>
          ))}
        </div>
        <NumberKeypad
          onNumberClick={handleNumberClick}
          leftAction="arrow"
          rightAction="submit"
          onBackspace={handleBackspace}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

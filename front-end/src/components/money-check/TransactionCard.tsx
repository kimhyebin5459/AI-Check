'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { TransactionType, TransactionRecord } from '@/types/transaction';
import { Bus, Tableware, Study, Enjoy, Living, RightTriangle, DownTriangle } from '@/public/icons';
import GroupedTransactionCard from './GroupedTransactionCard';

interface DutchPay {
  dutchPayId: number;
  displayName: string;
  amount: number;
  createdAt: string;
}

interface DutchPayResponse {
  recordId: number;
  dutchPays: DutchPay[];
}

export default function TransactionCard({
  recordId,
  firstCategoryName,
  secondCategoryName,
  isDutchPay,
  displayName,
  type,
  amount,
  description,
  rating,
  time,
}: TransactionRecord) {
  const [isOpened, setIsOpened] = useState(false);
  const [dutchPays, setDutchPays] = useState<DutchPay[]>([]);

  const getAmountDisplay = (type: TransactionType, amount: number): number => {
    if (type === 'DEPOSIT' || type === 'INBOUND_TRANSFER') {
      return +Math.abs(amount);
    } else {
      return -Math.abs(amount);
    }
  };

  useEffect(() => {
    if (isOpened && isDutchPay) {
      fetch(`/api/v1/dutch-pays?recordId=${recordId}`)
        .then((response) => response.json())
        .then((data: DutchPayResponse) => {
          setDutchPays(data.dutchPays);
        })
        .catch((error) => {
          console.error('더치페이 데이터 가져오기 실패:', error);
        });
    }
  }, [isOpened, recordId, isDutchPay]);

  const displayAmount = getAmountDisplay(type, amount);

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      교통비: Bus,
      식비: Tableware,
      교육비: Study,
      여가비: Enjoy,
      생활비: Living,
    };

    return iconMap[category] || null;
  };

  const categoryIcon = getCategoryIcon(firstCategoryName);

  const ratingEmoji = (rating: number) => {
    switch (rating) {
      case 1:
        return '😢';
      case 2:
        return '😊';
      case 3:
        return '😍';
      default:
        return '';
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpened(!isOpened);
  };

  return (
    <div>
      <Link href={`/money-check/detail?id=${recordId}`}>
        <div className="px-4 py-3 hover:bg-gray-50">
          <div className="flex items-center">
            <div className="flex h-16 flex-col">
              <div className="mr-3 mb-auto flex h-6 w-6 items-center justify-center rounded-md">
                {categoryIcon && <Image src={categoryIcon as string} alt={firstCategoryName} width={24} height={24} />}
              </div>
              {isDutchPay && (
                <div
                  className="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md"
                  onClick={handleOpen}
                >
                  {isOpened ? (
                    <Image src={DownTriangle} alt="접기" width={16} height={16} />
                  ) : (
                    <Image src={RightTriangle} alt="펼치기" width={16} height={16} />
                  )}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xl">
                <div className="font-bold text-gray-700">{displayName}</div>
                <div className={`font-medium ${displayAmount < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {displayAmount < 0 ? '-' : '+'}
                  {Math.abs(displayAmount).toLocaleString()}원
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-500">
                    {time} | {secondCategoryName}
                  </div>
                  <div className="flex justify-between font-light text-gray-500">{description}</div>
                </div>
                <div className="text-3xl">{ratingEmoji(rating)}</div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {isOpened && (
        <div className="ml-10 border-l-2 border-gray-300 pl-2">
          {dutchPays.map((dutchPay) => (
            <GroupedTransactionCard
              key={dutchPay.dutchPayId}
              dutchPayId={dutchPay.dutchPayId}
              displayName={dutchPay.displayName}
              amount={dutchPay.amount}
              time={dutchPay.createdAt.split(' ')[1].substring(0, 5)}
              description={`${displayName} 정산`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

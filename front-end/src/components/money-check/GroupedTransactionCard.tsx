'use client';

import React from 'react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';

import { Chain } from '@/public/icons';

export interface GroupedTransactionRecord {
  dutchPayId: number;
  displayName: string;
  amount: number;
  time: string;
  description?: string;
}

export default function GroupedTransactionCard({
  dutchPayId,
  displayName,
  amount,
  time,
  description,
}: GroupedTransactionRecord) {
  const getAmountDisplay = (amount: number): number => {
    return +Math.abs(amount);
  };

  const displayAmount = getAmountDisplay(amount);

  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/money-check/${dutchPayId}`);
  };

  return (
    <div className="px-4 py-3 hover:bg-gray-50" onClick={handleCardClick}>
      <div className="flex items-center">
        <div className="flex-1">
          <div className="flex items-center font-medium text-gray-700">
            {displayName}
            <Image src={Chain} alt="묶임" width={14} height={14} className="ml-1" />
          </div>
          <div className="text-xs text-gray-500">{time}</div>
          {description && <div className="font-light text-gray-500">{description}</div>}
        </div>
        <div className="text-right">
          <div className={`font-medium text-blue-500`}>+{Math.abs(displayAmount).toLocaleString()}원</div>
        </div>
      </div>
    </div>
  );
}

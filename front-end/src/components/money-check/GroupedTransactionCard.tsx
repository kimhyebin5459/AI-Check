'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

  return (
    <Link href={`/money-check/detail?id=${dutchPayId}`}>
      <div className="px-4 py-3 hover:bg-gray-50">
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
    </Link>
  );
}

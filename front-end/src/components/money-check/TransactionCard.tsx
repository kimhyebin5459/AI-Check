'use client';

import { useRouter } from 'next/navigation';

import { TransactionRecord } from '@/types/transaction';

import { getCategoryIcon, getAmountDisplay, getRatingEmoji } from '@/utils/formatTransaction';

export default function TransactionCard({
  recordId,
  firstCategoryName,
  secondCategoryName,
  displayName,
  type,
  amount,
  description,
  rating,
  time,
  isParent,
}: TransactionRecord & { isParent?: boolean }) {
  const displayAmount = getAmountDisplay(type, amount);

  const CategoryIcon = getCategoryIcon(firstCategoryName);

  const router = useRouter();

  const handleCardClick = () => {
    if (isParent) {
      router.push(`/manage-child/money-check/detail/${recordId}`);
    } else {
      router.push(`/money-check/${recordId}`);
    }
  };

  return (
    <div className="px-4 py-3 hover:bg-gray-50" onClick={handleCardClick}>
      <div className="flex items-center">
        <div className="flex h-16 flex-col">
          <div className="mr-3 mb-auto flex h-6 w-6 items-center justify-center rounded-md">
            {CategoryIcon && <CategoryIcon />}
          </div>
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
            {!!rating && <div className="text-3xl">{getRatingEmoji(rating)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

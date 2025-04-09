'use client';

import { useRouter } from 'next/navigation';

import { TransactionRecord, TransactionType, TransactionFilterType } from '@/types/transaction';

import { getCategoryIcon, getRatingEmoji, getTransactionDirection } from '@/utils/formatTransaction';

const getAmountDisplayFormat = (type: TransactionType | TransactionFilterType, amount: number) => {
  const direction = getTransactionDirection(type);
  const amountClass = direction === 'INCOME' ? 'text-blue-500' : 'text-red-500';
  const prefix = direction === 'INCOME' ? '+' : '-';

  return {
    direction,
    amountClass,
    formattedAmount: `${prefix}${Math.abs(amount).toLocaleString()}원`,
  };
};

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
  const { amountClass, formattedAmount } = getAmountDisplayFormat(type, amount);

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
      <div className="flex items-start">
        <div className="flex h-16 flex-col">
          <div className="mt-1 mr-3 mb-auto flex h-6 w-6 items-center justify-center rounded-md">
            {CategoryIcon && <CategoryIcon />}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xl">
            <div className="font-bold text-gray-700">{displayName}</div>
            <div className={`font-medium ${amountClass}`}>{formattedAmount}</div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="text-xs font-medium text-gray-500">
                {time} | {secondCategoryName || ''}
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

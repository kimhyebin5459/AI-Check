import { SecondCategory } from '@/types/report';
import { formatMoney } from '@/utils/formatMoney';
import clsx from 'clsx';

interface Props {
  index: number;
  secondCategory: SecondCategory;
}

export default function SecondCategoryItem({ index, secondCategory }: Props) {
  const { displayName, amount, percentage } = secondCategory;

  return (
    <div className="flex w-full items-center justify-between px-2 text-xl">
      <div className="flex items-center space-x-3">
        <div
          className={clsx('flex size-7 items-center justify-center rounded-full', {
            'bg-chart-1': index === 0,
            'bg-chart-2': index === 1,
            'bg-chart-3': index === 2,
            'bg-chart-4': index === 3,
            'bg-chart-5': index === 4,
          })}
        ></div>
        <div>
          <p className="font-semibold">{displayName}</p>
          <p className="text-xs text-gray-600">{formatMoney(amount)}</p>
        </div>
      </div>
      <p className="text-lg font-semibold text-gray-600">{Math.floor(percentage)}%</p>
    </div>
  );
}

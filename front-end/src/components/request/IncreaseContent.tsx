import { formatMoney } from '@/utils/formatMoney';

interface Props {
  prevAmount: number;
  afterAmount: number;
}

export default function IncreaseContent({ prevAmount, afterAmount }: Props) {
  return (
    <div className="flex items-end space-x-1 pt-3">
      <div className="flex flex-col items-center space-y-1">
        <p className="text-sm font-bold text-gray-400">인상 전</p>
        <p className={`text rounded-lg bg-gray-100 px-2 text-xl font-bold whitespace-nowrap text-gray-700`}>
          {formatMoney(prevAmount)}
        </p>
      </div>
      <p className="size-8 text-center text-gray-400">→</p>
      <div className="flex flex-col items-center space-y-1">
        <p className="text-sm font-bold text-gray-400">인상 후</p>
        <p className={`text rounded-lg bg-yellow-100 px-2 text-xl font-bold whitespace-nowrap text-yellow-400`}>
          {formatMoney(afterAmount)}
        </p>
      </div>
    </div>
  );
}

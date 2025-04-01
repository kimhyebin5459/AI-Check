import { formatMoney } from '@/utils/formatMoney';

interface Props {
  type: 'before' | 'after';
  amount: number;
}

export default function IncreaseBadge({ type, amount }: Props) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <p className="text-sm font-bold text-gray-400">{type === 'before' ? '인상 전' : '인상 후'}</p>
      <p
        className={`text rounded-lg px-2 py-1 text-xl font-bold whitespace-nowrap ${type === 'before' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-400'}`}
      >
        {formatMoney(amount)}
      </p>
    </div>
  );
}

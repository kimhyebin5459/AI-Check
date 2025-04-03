import { peerCategory } from '@/types/report';
import { formatMoney } from '@/utils/formatMoney';
import CategoryIcon from '@/components/report/CategoryIcon';
import PeerGapBadge from './PeerGapBadge';

interface Props {
  peerCategory: peerCategory;
}

export default function PeerCategoryItem({ peerCategory }: Props) {
  const { name, amount, peerAmount } = peerCategory;

  return (
    <div className="flex w-full items-center justify-between px-1 py-2 font-semibold">
      <div className="flex items-center space-x-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-gray-100">
          <CategoryIcon icon={name} color="white" strokeWidth={1} />
        </div>
        <p className="text-xl font-semibold">{name}</p>
      </div>
      <div className="text-right">
        <div className="flex items-center space-x-1">
          <PeerGapBadge amount={amount} peerAmount={peerAmount} />
          <p className="min-w-20">{formatMoney(amount)}</p>
        </div>
        <p className="text-sm text-gray-400">{formatMoney(peerAmount)}</p>
      </div>
    </div>
  );
}

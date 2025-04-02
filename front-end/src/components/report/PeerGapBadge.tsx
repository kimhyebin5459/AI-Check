import { formatMoney } from '@/utils/formatMoney';

interface Props {
  amount: number;
  peerAmount: number;
}

export default function PeerGapBadge({ amount, peerAmount }: Props) {
  const isSpentMore = amount > peerAmount;

  return amount === peerAmount ? (
    <></>
  ) : (
    <div
      className={`${isSpentMore ? 'bg-red-100 text-red-200' : 'bg-green-100 text-green-200'} h-fit min-w-20 rounded-lg px-1 text-center text-xs font-semibold`}
    >
      <span className={`${isSpentMore ? '' : 'rotate-180'} text-2xs mr-1 inline-block`}>▲</span>
      {formatMoney(Math.abs(amount - peerAmount))}
    </div>
  );
}

import PeerChart from '@/components/report/PeerChart';
import { peerReport } from '@/mocks/fixtures/report';
import { formatMoney } from '@/utils/formatMoney';
import PeerCategoryItem from './PeerCategoryItem';

interface Props {
  date: string;
  childId: string;
  name: string;
}

export default function PeerReportSection({ date, childId, name }: Props) {
  console.log(date.split('-'), childId);

  const { peer, totalAmount } = peerReport;

  return (
    <div className="w-full space-y-8 py-6">
      <div className="px-2 font-semibold">
        <p>총 소비 금액</p>
        <p className="text-3xl">{formatMoney(totalAmount)}</p>
      </div>
      <PeerChart reportData={peer} name={name} />
      <div className="space-y-2">
        {peer.map((category, index) => (
          <>
            <PeerCategoryItem key={category.name} peerCategory={category} />
            <div className={`w-full ${index < peer.length - 1 ? 'border-[0.03rem] border-gray-200' : ''} `}></div>
          </>
        ))}
      </div>
    </div>
  );
}

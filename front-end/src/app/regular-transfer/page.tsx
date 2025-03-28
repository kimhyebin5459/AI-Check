import Header from '@/components/common/Header';
import RegularTransferItem from '@/components/transfer/RegularTransferItem';
import { regularTransferList } from '@/mocks/fixtures/transfer';

export default function Page() {
  return (
    <div className="container">
      <Header hasBackButton title="자녀 정기 송금" />
      <div className="w-full overflow-y-auto px-5">
        {regularTransferList.map((rt, index) => (
          <div key={rt.childId}>
            <RegularTransferItem {...rt} />
            <div
              className={`w-full ${index < regularTransferList.length - 1 ? 'border-[0.03rem] border-gray-200' : ''} `}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

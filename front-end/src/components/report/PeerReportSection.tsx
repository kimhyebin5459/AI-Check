import PeerChart from '@/components/report/PeerChart';
import { categoryReport, peerReport } from '@/mocks/fixtures/report';
import { formatMoney } from '@/utils/formatMoney';
import PeerCategoryItem from '@/components/report/PeerCategoryItem';
import { mergeReports } from '@/utils/mergeReports';
import useGetCategoryReport from '@/hooks/query/useGetCategoryReport';
import useGetPeerReport from '@/hooks/query/useGetPeerReport';
import LoadingComponent from '@/app/_components/loading-component';

interface Props {
  date: string;
  childId: number;
}

export default function PeerReportSection({ date, childId }: Props) {
  const [year, month] = date.split('-').map(Number);
  const {
    data: categoryReport,
    isPending: isCategoryPending,
    isError: isCategoryError,
  } = useGetCategoryReport(year, month, childId);
  const { data: peerReport, isPending: isPeerPending, isError: isPeerError } = useGetPeerReport(year, month, childId);

  const categories = mergeReports(categoryReport?.categories ?? [], peerReport?.categories ?? []);

  if (isCategoryPending || isPeerPending) return <LoadingComponent isInner />;
  if (isCategoryError || isPeerError)
    return (
      <div className="flex h-full items-center pb-20 text-xl font-semibold text-gray-600">
        {year}년 {month}월의 리포트가 없어요.
      </div>
    );

  return (
    <>
      {categoryReport && peerReport && (
        <div className="flex w-full flex-col items-center space-y-5 py-6">
          <div className="w-full px-2 font-semibold">
            <p>총 소비 금액</p>
            <p className="text-3xl">{formatMoney(categoryReport.totalAmount)}</p>
          </div>
          <PeerChart reportData={categories} name={categoryReport.name} />
          <div className="w-full">
            {categories.map((category, index) => (
              <div key={category.name}>
                <PeerCategoryItem peerCategory={category} />
                <div
                  className={`w-full ${index < categories.length - 1 ? 'border-t-[0.03rem] border-gray-200' : ''} `}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

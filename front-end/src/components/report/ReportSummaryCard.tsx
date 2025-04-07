import useGetSummary from '@/hooks/query/useGetSummary';
import Image from 'next/image';

interface Props {
  reportId: string;
  childId: number;
}

export default function ReportSummaryCard({ reportId, childId }: Props) {
  const { data: summary } = useGetSummary(childId, reportId);

  return (
    <div className="rounded-modal bg-gradation1 relative inline-block w-full p-6">
      <p className="mb-5 w-fit rounded-lg bg-white px-2 text-sm text-gray-700">
        {summary?.year}년 {summary?.month}월
      </p>
      <div className="space-y-3 text-gray-800">
        <p className="font-light">
          {summary?.month}월 한달
          <br /> 가장 많이 돈을 쓴 곳은
          <br />
          <span className="text-xl font-bold">{summary?.firstCategoryName}</span>
          입니다.
          <br />그 다음은 <span className="text-xl font-bold">{summary?.secondCategoryName}</span>에 많이 썼어요.
        </p>
        <p className="font-light">
          <span className="text-xl font-bold">{summary?.totalCount}건</span>의 거래 중<br />
          <span className="text-xl font-bold">{summary?.memoCount}건</span>에 메모를 남겼어요.
        </p>
      </div>
      <div className="absolute top-6 right-3 size-24">
        <Image src="/images/duck.png" alt="duck icon" fill priority />
      </div>
    </div>
  );
}

import { reportSummary } from '@/mocks/fixtures/report';
import Image from 'next/image';

interface Props {
  year: number;
  month: number;
}

export default function ReportSummaryCard({ year, month }: Props) {
  const { first, second, memoCount, totalCount } = reportSummary;

  return (
    <div className="rounded-modal bg-gradation1 relative inline-block w-full p-6">
      <p className="mb-5 w-fit rounded-lg bg-white px-2 text-sm text-gray-700">
        {year}년 {month}월
      </p>
      <div className="space-y-3 text-gray-800">
        <p className="font-light">
          {month}월 한달
          <br /> 가장 많이 돈을 쓴 곳은
          <br />
          <span className="text-xl font-bold">{first}</span>
          입니다.
          <br />그 다음은 <span className="text-xl font-bold">{second}</span>에 많이 썼어요.
        </p>
        <p className="font-light">
          <span className="text-xl font-bold">{totalCount}건</span>의 거래 중<br />
          <span className="text-xl font-bold">{memoCount}건</span>에 메모를 남겼어요.
        </p>
      </div>
      <Image src="/images/duck.png" alt="duck icon" className="absolute top-6 right-3 size-24" />
    </div>
  );
}

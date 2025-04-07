'use client';

import FirstCategoryChart from '@/components/report/FirstCategoryChart';
import CategoryItem from '@/components/report/CategoryItem';
import useGetCategoryReport from '@/hooks/query/useGetCategoryReport';
import LoadingComponent from '@/app/_components/loading-component';
import IncreaseButton from './IncreaseButton';

interface Props {
  date: string;
  childId: number;
  userId: number;
}

export default function CategoryReportSection({ date, childId, userId }: Props) {
  const [year, month] = date.split('-').map(Number);
  const { data: report, isPending } = useGetCategoryReport(year, month, childId);

  if (isPending) return <LoadingComponent isInner />;
  if (!report)
    return (
      <div className="flex h-full items-center pb-20 text-xl font-semibold text-gray-600">
        {year}년 {month}월의 리포트가 없어요.
      </div>
    );

  return (
    <>
      {report && (
        <>
          <FirstCategoryChart reportData={report.categories} totalAmount={report.totalAmount} name={report.name} />
          {report.categories.map((catecory, index) => (
            <CategoryItem date={date} key={catecory.firstCategoryId} firstCategory={catecory} index={index} />
          ))}
          {userId === childId && report.id && <IncreaseButton reportId={report.id} childId={childId} />}
        </>
      )}
    </>
  );
}

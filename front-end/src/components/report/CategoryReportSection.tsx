import { categoryReport } from '@/mocks/fixtures/report';
import FirstCategoryChart from '@/components/report/FirstCategoryChart';
import CategoryItem from '@/components/report/CategoryItem';

interface Props {
  date: string;
  childId: string;
}

export default function CategoryReportSection({ date, childId }: Props) {
  console.log(date.split('-'), childId);

  const { categories, totalAmount } = categoryReport;

  return (
    <>
      <FirstCategoryChart reportData={categories} totalAmount={totalAmount} />
      {categories.map((catecory, index) => (
        <CategoryItem date={date} key={catecory.firstCategoryId} firstCategory={catecory} index={index} />
      ))}
    </>
  );
}

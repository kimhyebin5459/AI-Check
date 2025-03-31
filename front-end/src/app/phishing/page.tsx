import Header from '@/components/common/Header';

export default function Page() {
  return (
    <div className="container bg-gray-50">
      <Header hasBackButton hasBorder={false} title="우리 가족 피싱 위험" />
      <div className="text-3xl">피싱 페이지</div>
    </div>
  );
}

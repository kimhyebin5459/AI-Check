import Header from '@/components/common/Header';

export default function Page() {
  return (
    <div className="container bg-gray-50">
      <Header hasBackButton hasBorder={false} title="용돈 요청 내역" />
      <div className="text-3xl">용돈 요청 페이지</div>
    </div>
  );
}

import Header from '@/components/common/Header';

export default function Page() {
  return (
    <div className="container bg-gray-50">
      <Header hasBackButton title="내 정보" hasBorder={false} />내 정보 페이지
    </div>
  );
}

import Header from '@/components/common/Header';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;
  return (
    <div className="container bg-gray-50">
      <Header hasBackButton title="인상 요청 내역" hasBorder={false} />
      인상 요청 {id}번 상세 페이지
    </div>
  );
}

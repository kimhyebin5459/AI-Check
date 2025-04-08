import Header from '@/components/common/Header';
import RequestIncreaseSection from '@/components/request/RequestIncreaseSection';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;
  return (
    <div className="container bg-gray-50 px-5">
      <Header hasBackButton title="용돈 인상 요청" hasBorder={false} backPath="/request" />
      <RequestIncreaseSection paramsId={id} />
    </div>
  );
}

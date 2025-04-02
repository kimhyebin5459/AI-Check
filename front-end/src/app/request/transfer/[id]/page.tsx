import Header from '@/components/common/Header';
import RequestTransferSection from '@/components/request/RequestTransferSection';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;
  return (
    <div className="container bg-gray-50 px-5">
      <Header hasBackButton title="용돈 송금 요청" hasBorder={false} />
      <RequestTransferSection paramsId={id} />
    </div>
  );
}

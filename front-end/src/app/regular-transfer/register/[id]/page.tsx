import Header from '@/components/common/Header';
import RegularTransferRegisterSection from '@/components/regular-transfer/RegularTransferRegisterSection';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;

  return (
    <div className="container px-5">
      <Header hasBackButton hasBorder={false} />
      <RegularTransferRegisterSection paramsId={id} />
    </div>
  );
}

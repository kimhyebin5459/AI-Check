import RegularTransferRegister from '@/components/transfer/RegularTransferRegister';

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;

  return <RegularTransferRegister paramsId={id} />;
}

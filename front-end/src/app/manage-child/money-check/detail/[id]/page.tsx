import ParentTransactionDetail from '@/components/money-check/ParentSideTransactionDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;

  return <ParentTransactionDetail paramsId={id} />;
}

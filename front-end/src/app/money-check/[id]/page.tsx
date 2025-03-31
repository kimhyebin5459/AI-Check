import TransactionDetail from '@/components/money-check/TransactionDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;

  return <TransactionDetail paramsId={id} />;
}

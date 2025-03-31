import TransactionDetail from '@/components/money-check/TransactionDetail';

export async function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;

  return <TransactionDetail paramsId={id} />;
}

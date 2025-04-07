import ReportSection from '@/components/report/ReportSection';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;
  return (
    <div className="container">
      <ReportSection paramsId={id} />
    </div>
  );
}

import ReportSection from '@/components/report/ReportSection';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;
  return (
    <div className="container px-5">
      <ReportSection paramsId={id} />
      <div className="text-3xl">소비 리포트 페이지</div>
    </div>
  );
}

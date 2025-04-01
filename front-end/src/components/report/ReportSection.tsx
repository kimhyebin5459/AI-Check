import Header from '@/components/common/Header';

interface Props {
  paramsId: string;
}

export default function ReportSection({ paramsId }: Props) {
  return (
    <>
      <Header hasBackButton title="소비 리포트" hasBorder={false} />
    </>
  );
}

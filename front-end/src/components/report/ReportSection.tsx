'use client';

import Header from '@/components/common/Header';
import Button from '../common/Button';
import { useRouter } from 'next/navigation';

interface Props {
  paramsId?: string;
}

export default function ReportSection({ paramsId }: Props) {
  const router = useRouter();

  const handleClick = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    router.push(`/request/send?year=${year}&month=${month}`);
  };

  return (
    <>
      <Header hasBackButton title="소비 리포트" hasBorder={false} />

      <div className="bottom-btn">
        <Button onClick={handleClick}>용돈 인상 요청 보내기</Button>
      </div>
    </>
  );
}

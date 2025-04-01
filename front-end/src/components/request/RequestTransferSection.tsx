'use client';

import { requestTransfer } from '@/mocks/fixtures/request';
import { useRouter } from 'next/navigation';
import RequestDetailCard from '@/components/request/RequestDetailCard';
import ArrowButton from '@/components/common/ArrowButton';

interface Props {
  paramsId: string;
}

export default function RequestTransferSection({ paramsId }: Props) {
  const router = useRouter();

  const request = requestTransfer;

  const handleClick = () => {
    router.push(`/report/${request.childId}`);
  };

  return (
    <>
      <RequestDetailCard {...request} />
      <ArrowButton text="리포트 보러가기" onClick={handleClick} />
    </>
  );
}

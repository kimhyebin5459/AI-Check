'use client';

import { useRouter } from 'next/navigation';
import RequestDetailCard from '@/components/request/RequestDetailCard';
import ArrowButton from '@/components/common/ArrowButton';
import useGetTransferRequest from '@/hooks/query/useGetTransferRequest';
import usePatchTransferRequest from '@/hooks/query/usePatchTransferRequest';
import LoadingComponent from '@/app/_components/loading-component';
import ErrorComponent from '@/app/_components/error-component';

interface Props {
  paramsId: string;
}

export default function RequestTransferSection({ paramsId }: Props) {
  const router = useRouter();

  const requestId = Number(paramsId);

  const { data: request } = useGetTransferRequest(requestId);

  const { mutate: createTransferReply, isPending, isError } = usePatchTransferRequest();

  const handleClickReport = () => {
    router.push(`/report/${request?.childId}`);
  };

  if (isPending) return <LoadingComponent isInner />;
  if (isError) return <ErrorComponent />;

  return (
    <>
      {request && <RequestDetailCard {...request} onReply={createTransferReply} />}
      <ArrowButton text="리포트 보러가기" onClick={handleClickReport} />
    </>
  );
}

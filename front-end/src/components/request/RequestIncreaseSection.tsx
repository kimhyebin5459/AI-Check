'use client';

import { useRouter } from 'next/navigation';
import RequestDetailCard from './RequestDetailCard';
import ArrowButton from '../common/ArrowButton';
import useModal from '@/hooks/useModal';
import RequestIncreaseModal from './RequestIncreaseModal';
import useGetIncreaseRequest from '@/hooks/query/useGetIncreaseRequest';
import usePostIncreaseReply from '@/hooks/query/usePostIncreaseReply';
import LoadingComponent from '@/app/_components/loading-component';
import ErrorComponent from '@/app/_components/error-component';

interface Props {
  paramsId: string;
}

export default function RequestIncreaseSection({ paramsId }: Props) {
  const router = useRouter();
  const requestId = Number(paramsId);

  const { isModalOpen, openModal, closeModal } = useModal();

  const { data: request } = useGetIncreaseRequest(requestId);
  const { mutate: createIncreaseReply, isPending, isError } = usePostIncreaseReply();

  const handleClickReport = () => {
    router.push(`/report/${request?.childId}`);
  };

  if (isPending) return <LoadingComponent isInner />;
  if (isError) return <ErrorComponent />;

  return (
    <>
      {request && (
        <>
          <RequestDetailCard {...request} amount={request.afterAmount} onReply={createIncreaseReply} />
          <ArrowButton text="리포트 보러가기" onClick={handleClickReport} />
          <ArrowButton text="소비 요약 보기" onClick={openModal} />
          <RequestIncreaseModal
            name={request.childName}
            childId={request?.childId}
            reportId={request?.reportId}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
          />
        </>
      )}
    </>
  );
}

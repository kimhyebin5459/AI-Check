'use client';

import { requestInCrease } from '@/mocks/fixtures/request';
import { useRouter } from 'next/navigation';
import RequestDetailCard from './RequestDetailCard';
import ArrowButton from '../common/ArrowButton';
import useModal from '@/hooks/useModal';
import RequestIncreaseModal from './RequestIncreaseModal';

interface Props {
  paramsId: string;
}

export default function RequestIncreaseSection({ paramsId }: Props) {
  const router = useRouter();

  const { isModalOpen, openModal, closeModal } = useModal();

  const request = requestInCrease;

  const handleClickReport = () => {
    router.push(`/report/${request.childId}`);
  };

  return (
    <>
      <RequestDetailCard {...request} amount={request.afterAmount} />
      <ArrowButton text="리포트 보러가기" onClick={handleClickReport} />
      <ArrowButton text="소비 요약 보기" onClick={openModal} />
      <RequestIncreaseModal
        name={request.childName}
        year={2025}
        month={4}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />
    </>
  );
}

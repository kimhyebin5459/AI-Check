'use client';

import Modal from '@/components/common/Modal';
import ReportSummaryCard from '../report/ReportSummaryCard';

interface Props {
  name: string;
  year: number;
  month: number;
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function RequestIncreaseModal({ name, year, month, isModalOpen, closeModal }: Props) {
  return (
    <Modal position="bottom" isOpen={isModalOpen} onClose={closeModal} title={`${name}님 소비 요약`}>
      {/* 빌드 오류로 주석처리함 */}
      {/* <ReportSummaryCard year={year} month={month} /> */}
    </Modal>
  );
}

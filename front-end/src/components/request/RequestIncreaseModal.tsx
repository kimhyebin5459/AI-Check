'use client';

import Modal from '@/components/common/Modal';
import ReportSummaryCard from '../report/ReportSummaryCard';

interface Props {
  name: string;
  childId: number;
  reportId: string;
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function RequestIncreaseModal({ name, childId, reportId, isModalOpen, closeModal }: Props) {
  return (
    <Modal position="bottom" isOpen={isModalOpen} onClose={closeModal} title={`${name}님 소비 요약`}>
      <ReportSummaryCard childId={childId} reportId={reportId} />
    </Modal>
  );
}

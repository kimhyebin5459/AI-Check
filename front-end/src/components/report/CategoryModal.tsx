'use client';

import Modal from '@/components/common/Modal';
import { FirstCategory } from '@/types/report';
import SecondCategoryChart from '@/components/report/SecondCategoryChart';
import SecondCategoryItem from '@/components/report/SecondCategoryItem';

interface Props {
  date: string;
  firstCategory: FirstCategory;
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function CategoryModal({ date, firstCategory, isModalOpen, closeModal }: Props) {
  const [year, month] = date.split('-');
  const { displayName, amount, subCategories } = firstCategory;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title={`${year}년 ${Number(month)}월 ${displayName} 리포트`}>
      <SecondCategoryChart reportData={subCategories} amount={amount} />
      <div className="w-full space-y-3 pb-3">
        {subCategories.map((category, index) => (
          <SecondCategoryItem key={category.displayName} secondCategory={category} index={index} />
        ))}
      </div>
    </Modal>
  );
}

'use client';

import Modal from '@/components/common/Modal';
import { firstCategory } from '@/types/report';
import SecondCategoryChart from '@/components/report/SecondCategoryChart';
import SecondCategoryItem from '@/components/report/SecondCategoryItem';

interface Props {
  date: string;
  firstCategory: firstCategory;
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function CategoryModal({ date, firstCategory, isModalOpen, closeModal }: Props) {
  const [year, month] = date.split('-');
  const { name, amount, secondCategory } = firstCategory;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title={`${year}년 ${Number(month)}월 ${name} 리포트`}>
      <SecondCategoryChart reportData={secondCategory} amount={amount} />
      <div className="w-full space-y-3 pb-3">
        {secondCategory.map((secondCategory, index) => (
          <SecondCategoryItem
            key={secondCategory.name}
            secondCategory={secondCategory}
            index={index}
            totalAmount={amount}
          />
        ))}
      </div>
    </Modal>
  );
}

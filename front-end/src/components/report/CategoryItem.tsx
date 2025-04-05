import { Arrow } from '@/public/icons';
import { formatMoney } from '@/utils/formatMoney';
import clsx from 'clsx';
import Image from 'next/image';
import CategoryIcon from './CategoryIcon';
import useModal from '@/hooks/useModal';
import CategoryModal from './CategoryModal';
import { FirstCategory } from '@/types/report';

interface Props {
  date: string;
  firstCategory: FirstCategory;
  index: number;
}

export default function CategoryItem({ date, firstCategory, index }: Props) {
  const { displayName, amount, percentage } = firstCategory;
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between px-2" onClick={openModal}>
        <div className="flex items-center space-x-4">
          <div
            className={clsx('flex size-13 items-center justify-center rounded-full', {
              'bg-chart-1': index === 0,
              'bg-chart-2': index === 1,
              'bg-chart-3': index === 2,
              'bg-chart-4': index === 3,
              'bg-chart-5': index === 4,
            })}
          >
            <CategoryIcon icon={displayName} color="white" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-semibold">{displayName}</p>
            <div className="flex space-x-4 font-semibold text-gray-800">
              <p>{Math.floor(percentage)}%</p>
              <p>{formatMoney(amount)}</p>
            </div>
          </div>
        </div>
        <div className="size-7 rotate-180">
          <Image src={Arrow} alt="arrow icon" />
        </div>
      </div>
      <CategoryModal firstCategory={firstCategory} date={date} isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
}

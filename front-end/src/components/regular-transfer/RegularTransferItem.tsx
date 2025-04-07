'use client';

import { formatMoney } from '@/utils/formatMoney';
import ProfileImage from '@/components/common/ProfileImage';
import Button from '@/components/common/Button';
import { formatInterval } from '@/utils/formatInterval';
import useModal from '@/hooks/useModal';
import RegularTransferModal from '@/components/regular-transfer/RegularTransferModal';
import { useRouter } from 'next/navigation';
import { formatDay } from '@/utils/formatDay';
import Plus from '@/public/icons/common/Plus';
import { RegularTransfer } from '@/types/regularTransfer';

interface Props {
  index: number;
  schedule: RegularTransfer;
}

export default function RegularTransferItem({ index, schedule }: Props) {
  const { amount, interval, day, scheduleId } = schedule.schedules[0] || {};

  const { isModalOpen, openModal, closeModal } = useModal();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/regular-transfer/register/${index}`);
  };

  return (
    <>
      <div className="flex h-64 w-full flex-col justify-between p-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-4">
            <ProfileImage size="md" image={schedule?.image} />
            <p className="text-2xl font-bold">{schedule?.childName}</p>
          </div>
          {!interval && (
            <div className="flex size-8 items-center justify-center" onClick={handleClick}>
              <Plus size={20} />
            </div>
          )}
        </div>
        {interval ? (
          <>
            <div className="flex flex-col space-y-3 font-semibold">
              <div className="flex justify-between">
                <p>송금 일정</p>
                <p>
                  {formatInterval(interval)} {formatDay(day)}
                </p>
              </div>
              <div className="flex justify-between">
                <p>금액</p>
                <p>{formatMoney(amount)}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="secondary" onClick={openModal}>
                취소
              </Button>
              <Button onClick={handleClick}>수정</Button>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xl font-semibold text-gray-600">등록된 정기 송금이 없어요</p>
          </div>
        )}
      </div>
      {scheduleId && (
        <RegularTransferModal
          scheduleId={scheduleId}
          name={schedule?.childName}
          image={schedule?.image}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
        />
      )}
    </>
  );
}

'use client';

import Modal from '@/components/common/Modal';
import ProfileImage from '@/components/common/ProfileImage';
import Button from '@/components/common/Button';
import { formatMoney } from '@/utils/formatMoney';
import { getNextDate } from '@/utils/getNextDate';
import { useEffect, useState } from 'react';
import { formatInterval } from '@/utils/formatInterval';
import usePostRegularTransferList from '@/hooks/query/usePostRegularTransferList';
import { IntervalType } from '@/types/regularTransfer';
import usePatchRegularTransferList from '@/hooks/query/usePatchRegularTransferList';
import useGetMyAccount from '@/hooks/query/useGetMyAccount';

interface Props {
  childId: number;
  scheduleId: number;
  name: string;
  image: string;
  amount: number;
  interval: IntervalType;
  day: string;
  isModalOpen: boolean;
  closeModal: () => void;
  isNewSchedule: boolean;
}

export default function RegularTransferRegisterModal({
  childId,
  scheduleId,
  name,
  image,
  amount,
  interval,
  day,
  isModalOpen,
  closeModal,
  isNewSchedule,
}: Props) {
  const { data: account, isLoading } = useGetMyAccount();

  const { mutate: addRegularTransfer } = usePostRegularTransferList();
  const { mutate: updateRegularTransfer } = usePatchRegularTransferList();

  const [startDate, setStartDate] = useState<string>('');

  useEffect(() => {
    if (isModalOpen && interval && day) {
      const calculatedNextDate = getNextDate(formatInterval(interval), day);
      setStartDate(calculatedNextDate);
    }
  }, [isModalOpen, interval, day]);

  const handleClick = () => {
    if (isNewSchedule) {
      addRegularTransfer({ childId, amount, interval, startDate });
    } else {
      updateRegularTransfer({ scheduleId, schedule: { childId, amount, interval, startDate } });
    }
    closeModal();
  };

  return (
    <Modal position="bottom" isOpen={isModalOpen} onClose={closeModal} title="정기 용돈 송금 정보">
      <div className="flex flex-col items-center text-xl font-bold">
        <ProfileImage image={image} size="md" />
        <p className="pt-2">{name} 에게</p>
        <div className="flex space-x-1">
          <p className="text-yellow-400">
            {formatInterval(interval)} {day}
          </p>
          <p>송금할게요</p>
        </div>
      </div>
      <div className="w-full space-y-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold">
        <div className="flex justify-between">
          <p>금액</p>
          <p>{formatMoney(Number(amount))}</p>
        </div>
        <div className="border-[0.03rem] border-gray-200"></div>
        <div className="flex justify-between">
          <p>출금 계좌</p>
          <p className="text-gray-600">{isLoading ? '로딩 중...' : account?.accountNo}</p>
        </div>
        <div className="border-[0.03rem] border-gray-200"></div>
        <div className="flex justify-between">
          <p>첫 송금일</p>
          <p className="text-gray-600">{startDate}</p>
        </div>
      </div>
      <Button onClick={handleClick} isDisabled={isLoading}>
        등록하기
      </Button>
    </Modal>
  );
}

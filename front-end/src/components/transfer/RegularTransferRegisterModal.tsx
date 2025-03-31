'use client';

import Modal from '@/components/common/Modal';
import { useRouter } from 'next/navigation';
import ProfileImage from '@/components/common/ProfileImage';
import Button from '@/components/common/Button';
import { formatMoney } from '@/utils/formatMoney';
import { getNextDate } from '@/utils/getNextDate';
import { useEffect, useState } from 'react';
import { account } from '@/mocks/fixtures/account';
import { formatInterval } from '@/utils/formatInterval';

interface Props {
  name: string;
  image: string;
  amount: number;
  interval: string;
  day: string;
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function RegularTransferRegisterModal({
  name,
  image,
  amount,
  interval,
  day,
  isModalOpen,
  closeModal,
}: Props) {
  const router = useRouter();
  const myAccount = account.accountNo;

  const [nextDate, setNextDate] = useState<string | null>(null);

  useEffect(() => {
    if (isModalOpen && interval && day) {
      const calculatedNextDate = getNextDate(formatInterval(interval), day);
      setNextDate(calculatedNextDate);
    }
  }, [isModalOpen, interval, day]);

  const handleClick = () => {
    console.log(amount, interval, nextDate);
    router.push('/regular-transfer');
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
          <p className="text-gray-600">{myAccount}</p>
        </div>
        <div className="border-[0.03rem] border-gray-200"></div>
        <div className="flex justify-between">
          <p>첫 송금일</p>
          <p className="text-gray-600">{nextDate}</p>
        </div>
      </div>
      <Button onClick={handleClick}>등록하기</Button>
    </Modal>
  );
}

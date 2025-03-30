'use client';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import ProfileImage from '@/components/common/ProfileImage';
import IntervalTags from '@/components/transfer/IntervalTags';
import RegularTransferRegisterModal from '@/components/transfer/RegularTransferRegisterModal';
import useInput from '@/hooks/useInput';
import useModal from '@/hooks/useModal';
import { regularTransferList } from '@/mocks/fixtures/transfer';
import { formatDay } from '@/utils/formatDay';
import {} from '@/utils/formatInterval';
import { getDayOptions } from '@/utils/getDayOptions';
import React, { use, useEffect, useRef } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: Props) {
  const { id } = use(params);
  const { childName, image, amount, interval, day } = regularTransferList[Number(id) - 1];

  const { value: selectedAmount, onChange: handleAmountChange } = useInput<number>(amount || 0);
  const { value: selectedInterval, setValue: setSelectedInterval } = useInput<string>(interval || '');
  const {
    value: selectedDay,
    onChange: handleDayChange,
    setValue: setSelectedDay,
  } = useInput<string>(day ? formatDay(day) : '');
  const { isModalOpen, openModal, closeModal } = useModal();

  const prevSelectedInterval = useRef(selectedInterval);

  useEffect(() => {
    if (prevSelectedInterval.current !== selectedInterval) {
      setSelectedDay('');
    }
    prevSelectedInterval.current = selectedInterval;
  }, [selectedInterval, setSelectedDay]);

  const formatNumber = (num: string) => {
    if (!num) return '';
    return num.replace(/\D/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const formattedValue = formatNumber(rawValue);
    handleAmountChange({ target: { value: formattedValue } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      <div className="container px-5">
        <Header hasBackButton hasBorder={false} />
        <div className="h-full w-full space-y-8 py-10">
          <div className="text-mdl font-bold">
            <div className="flex items-end space-x-3 pb-1">
              <ProfileImage image={image} size="md" />
              <p>{childName} 에게</p>
            </div>
            <p>정기적으로 용돈을 보낼게요</p>
          </div>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="금액"
              value={selectedAmount !== 0 ? selectedAmount.toString() : ''}
              onChange={handleChange}
            >
              <div className="relative mx-auto max-w-[480px]">
                <div className="absolute top-1/2 right-5 -translate-y-1/2 transform">
                  <p className="text-xl font-bold">원</p>
                </div>
              </div>
            </Input>
            <IntervalTags selectedInterval={selectedInterval} onSelect={setSelectedInterval} />
            {selectedInterval !== '' && (
              <div className="flex h-12 w-full items-center rounded-2xl border border-gray-300 px-4 text-gray-700">
                <select
                  id="day-selector"
                  value={selectedDay}
                  onChange={handleDayChange}
                  className="h-full w-full focus:outline-none"
                >
                  <option value="" hidden>
                    주기
                  </option>
                  {getDayOptions(selectedInterval).map((day, index) => (
                    <option key={index} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        {selectedDay && selectedAmount !== 0 && (
          <div className="w-full pb-10">
            <Button size="lg" onClick={openModal}>
              등록하기
            </Button>
          </div>
        )}
      </div>
      <RegularTransferRegisterModal
        name={childName}
        image={image}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        amount={selectedAmount}
        interval={selectedInterval}
        day={selectedDay}
      />
    </>
  );
}

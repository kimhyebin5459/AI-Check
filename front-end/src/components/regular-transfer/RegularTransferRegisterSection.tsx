'use client';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ProfileImage from '@/components/common/ProfileImage';
import RegularTransferRegisterModal from '@/components/regular-transfer/RegularTransferRegisterModal';
import useModal from '@/hooks/useModal';
import { getDayOptions } from '@/utils/getDayOptions';
import IntervalTags from './IntervalTags';
import useGetRegularTransferList from '@/hooks/query/useGetRegularTransferList';
import LoadingComponent from '@/app/_components/loading-component';
import ErrorComponent from '@/app/_components/error-component';
import useRegularTransferForm from '@/hooks/useRegularTransferForm';

interface Props {
  paramsId: string;
}

export default function RegularTransferRegisterSection({ paramsId }: Props) {
  const { data, isPending, isError } = useGetRegularTransferList();
  const { childId, childName, image, schedules } = data?.[Number(paramsId)] || {};
  const { amount, interval, day, scheduleId } = schedules?.[0] || {};

  const { selectedAmount, selectedInterval, selectedDay, handleChange, handleDayChange, setSelectedInterval } =
    useRegularTransferForm(amount, interval, day);

  const { isModalOpen, openModal, closeModal } = useModal();

  if (isPending) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return (
    <>
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
          {selectedInterval && (
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
      <RegularTransferRegisterModal
        childId={childId || 0}
        name={childName || ''}
        image={image || ''}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        amount={Number(selectedAmount)}
        interval={selectedInterval || 'WEEKLY'}
        day={selectedDay}
        isNewSchedule={!amount}
        scheduleId={scheduleId || 0}
      />
    </>
  );
}

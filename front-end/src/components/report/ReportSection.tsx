'use client';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import useInput from '@/hooks/useInput';
import Image from 'next/image';
import { Arrow } from '@/public/icons';
import { useState } from 'react';
import CategoryReportSection from './CategoryReportSection';
import PeerReportSection from './PeerReportSection';
import useGetUserInfo from '@/hooks/query/useGetUserInfo';

interface Props {
  paramsId: string;
}

export default function ReportSection({ paramsId }: Props) {
  const childId = Number(paramsId);

  const { value, onChange } = useInput<string>(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)
  );
  const [isCategory, setIsCategory] = useState<boolean>(true);

  const { data: user } = useGetUserInfo();

  const handleOpenPicker = () => {
    const input = document.querySelector("input[type='month']") as HTMLInputElement | null;
    if (input) {
      input.showPicker();
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto px-5">
      <Header hasBackButton title="소비 리포트" hasBorder={false} />
      <div className="relative">
        <input
          type="month"
          value={value}
          onChange={onChange}
          className="pt-4 text-2xl font-bold outline-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
        <Image
          src={Arrow}
          alt="month icon"
          className="absolute -right-1 bottom-1 size-6 rotate-270"
          onClick={handleOpenPicker}
        />
      </div>
      <div className="mt-6 flex w-full rounded-xl bg-gray-100">
        <Button variant={`${isCategory ? 'primary' : 'secondary'}`} onClick={() => setIsCategory(true)}>
          분류
        </Button>
        <Button variant={`${!isCategory ? 'primary' : 'secondary'}`} onClick={() => setIsCategory(false)}>
          또래 비교
        </Button>
      </div>
      {isCategory ? (
        <CategoryReportSection date={value} childId={childId} userId={user?.memberId || 0} />
      ) : (
        <PeerReportSection date={value} childId={childId} />
      )}
    </div>
  );
}

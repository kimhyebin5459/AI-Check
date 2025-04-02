'use client';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import useInput from '@/hooks/useInput';
import Image from 'next/image';
import { Arrow } from '@/public/icons';
import { useEffect, useState } from 'react';
import CategoryReportSection from './CategoryReportSection';
import PeerReportSection from './PeerReportSection';
import { user } from '@/mocks/fixtures/user';

interface Props {
  paramsId: string;
}

export default function ReportSection({ paramsId }: Props) {
  const router = useRouter();

  const { value, onChange } = useInput<string>(new Date().toISOString().slice(0, 7));
  const [isCategory, setIsCategory] = useState<boolean>(true);
  const name = user.name;

  useEffect(() => {}, [value]);

  const handleClick = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    router.push(`/request/send?year=${year}&month=${month}`);
  };

  const handleOpenPicker = () => {
    const input = document.querySelector("input[type='month']") as HTMLInputElement | null;
    if (input) {
      input.showPicker();
    }
  };

  return (
    <div className="flex w-full flex-col items-center overflow-y-auto px-5">
      <Header hasBackButton title={`${name}의 소비 리포트`} hasBorder={false} />
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
        <>
          <CategoryReportSection date={value} childId={paramsId} />
          <div className="w-full pt-5 pb-10">
            <Button onClick={handleClick}>용돈 인상 요청 보내기</Button>
          </div>
        </>
      ) : (
        <PeerReportSection date={value} childId={paramsId} name={name} />
      )}
    </div>
  );
}

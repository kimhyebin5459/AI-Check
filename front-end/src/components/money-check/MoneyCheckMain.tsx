'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import TransactionCard from '@/components/money-check/TransactionCard';
import ProfileImage from '@/components/common/ProfileImage';
import { ChartButton, CalendarButton } from '@/public/icons';

import { TransactionGroup } from '@/types/transaction';
import { Account } from '@/types/account';

interface User {
  image: string;
  // 기타 사용자 필드들
}

interface Props {
  userData: User;
  transactions: TransactionGroup[];
  account: Account;
}

export default function MoneyCheckClient({ userData, transactions, account }: Props) {
  // 이후 필터 구현 후 사용
  // const [recentTransactions, setRecentTransactions] = useState<TransactionGroup[]>(transactions);

  // 임시
  const recentTransactions = transactions;

  const router = useRouter();

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleChartClick = () => {
    router.push('/report/chart');
  };

  const handleCalendarClick = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    router.push(`/money-check/calendar?year=${year}&month=${month}`);
  };

  const handleFilterClick = () => {
    alert('필터 모달 오픈');
  };

  function formatDate(dateStr: string): string {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const [year, month, day] = dateStr.split('-').map((part) => parseInt(part, 10));

    const dateObj = new Date(year, month - 1, day);

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[dateObj.getDay()];

    if (year === currentYear) {
      return `${month}.${day} (${weekDay})`;
    } else {
      const shortYear = year % 100;
      return `${shortYear.toString().padStart(2, '0')}.${month}.${day} (${weekDay})`;
    }
  }

  return (
    <main className="w-full overflow-y-auto p-5">
      <div>
        <div className="flex w-full items-center justify-between">
          <div className="flex cursor-pointer items-center text-2xl">
            <div className="underline decoration-1 underline-offset-4" onClick={handleProfileClick}>
              <span className="font-bold">김○○</span>
              &nbsp;
              <span className="font-light">님</span>
            </div>
            <span className="ml-1">&gt;</span>
          </div>
          <div className="flex space-x-2">
            <Image src={ChartButton} alt="분석보기" onClick={handleChartClick} className="cursor-pointer" />
            <Image src={CalendarButton} alt="월별보기" onClick={handleCalendarClick} className="cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="my-4 rounded-xl bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]">
        <div className="rounded-t-lg bg-yellow-300 p-2.5">
          <div className="flex items-center">
            <ProfileImage image={userData.image} size="md" />
            <div className="ml-5 font-light">
              <p className="text-xl text-white">씨피뱅크 입출금 통장</p>
              <p className="text-base text-white">12-34567-89</p>
            </div>
          </div>
        </div>
        <div className="py-4">
          <div className="text-center text-4xl font-bold">{account?.balance && account.balance.toLocaleString()}원</div>
        </div>
        <div className="flex justify-center rounded-b-lg bg-white pb-3">
          <Button variant="primary" size="md" className="w-[220px]" isFullWidth={false}>
            송금
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-end border-b border-gray-400 px-4 py-3">
          <div className="cursor-pointer" onClick={handleFilterClick}>
            <span className="font-medium">한달 | 전체 ▼</span>
          </div>
        </div>

        <div className="divide-y divide-gray-400">
          {recentTransactions.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`} className="py-2">
              <div className="px-4 py-2 text-2xl font-medium text-gray-600">{formatDate(group.date)}</div>
              {group.records.map((record) => (
                <TransactionCard key={record.recordId} {...record} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

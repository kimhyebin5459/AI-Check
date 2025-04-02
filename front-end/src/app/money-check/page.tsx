'use client';

import React, { useState } from 'react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Footer from '@/components/common/footer/Footer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChartButton, CalendarButton } from '@/public/icons';
import ProfileImage from '@/components/common/ProfileImage';
import TransactionHistory from '@/components/money-check/TransactionHistory';
import DateFilterModal from '@/components/money-check/DateFilterModal';
import useModal from '@/hooks/useModal';

import { getFilterText } from '@/utils/formatTransaction';

import { user } from '@/mocks/fixtures/user';
import { account as accountData } from '@/mocks/fixtures/account';
import { Account } from '@/types/account';

export default function Page() {
  const [account, setAccount] = useState<Account>(accountData);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [transactionType, setTransactionType] = useState<string>('ALL');
  const [dateRangeType, setDateRangeType] = useState<string>('MONTH'); // 날짜 범위 타입 추가

  const { isModalOpen, openModal, closeModal } = useModal();

  const router = useRouter();

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleChartClick = () => {
    router.push('/report');
  };

  const handleCalendarClick = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    router.push(`/money-check/calendar?year=${year}&month=${month}`);
  };

  const handleFilterApply = (newStartDate: Date, newEndDate: Date, newType: string, newDateRangeType: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setTransactionType(newType);
    setDateRangeType(newDateRangeType);
  };

  return (
    <>
      <div className="h-full pb-[5.5rem]">
        <div className="container">
          <Header title="용돈 기록장" />
          <main className="scrollbar-hide w-full overflow-y-auto p-5">
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

            {/* 유저상태 관리 방법 정해지면 컴포넌트 분리 수정 */}
            <div className="my-4 rounded-xl bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]">
              <div className="rounded-t-lg bg-yellow-300 p-2.5">
                <div className="flex items-center">
                  <ProfileImage image={user.image} size="md" />
                  <div className="ml-5 font-light">
                    <p className="text-xl text-white">씨피뱅크 입출금 통장</p>
                    <p className="text-base text-white">12-34567-89</p>
                  </div>
                </div>
              </div>
              <div className="py-4">
                <div className="text-center text-4xl font-bold">
                  {account?.balance && account.balance.toLocaleString()}원
                </div>
              </div>
              <div className="flex justify-center rounded-b-lg bg-white pb-3">
                <Button variant="primary" size="md" className="w-[220px]" isFullWidth={false}>
                  송금
                </Button>
              </div>
            </div>

            <TransactionHistory
              startDate={startDate}
              endDate={endDate}
              type={transactionType}
              showFilterHeader={true}
              onFilterClick={openModal}
              customFilterText={getFilterText(dateRangeType, transactionType)}
            />
          </main>
          <Footer />
        </div>
      </div>

      <DateFilterModal
        isModalOpen={isModalOpen}
        onClose={closeModal}
        onApply={handleFilterApply}
        initialStartDate={startDate}
        initialEndDate={endDate}
        initialType={transactionType}
        initialDateRangeType={dateRangeType}
      />
    </>
  );
}

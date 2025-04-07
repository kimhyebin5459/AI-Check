'use client';

import React, { useState } from 'react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Footer from '@/components/common/footer/Footer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChartButton, CalendarButton, Sprout, Arrow } from '@/public/icons';
import ProfileImage from '@/components/common/ProfileImage';
import TransactionHistory from '@/components/money-check/TransactionHistory';
import DateFilterModal from '@/components/money-check/DateFilterModal';
import useModal from '@/hooks/useModal';
import Link from 'next/link';

import { getFilterText } from '@/utils/formatTransaction';

import { account as defaultAccountData } from '@/mocks/fixtures/account';
import { TransactionFilterType } from '@/types/transaction';
import { useUserStore } from '@/stores/useUserStore';
import useGetMyAccount from '@/hooks/query/useGetMyAccount';
import useGetUserInfo from '@/hooks/query/useGetUserInfo';

export default function Page() {
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [transactionType, setTransactionType] = useState<TransactionFilterType>('ALL');
  const [dateRangeType, setDateRangeType] = useState<string>('MONTH');

  const { isModalOpen, openModal, closeModal } = useModal();
  const { isParent } = useUserStore();
  const { data: account, isLoading } = useGetMyAccount();
  const { data: user } = useGetUserInfo();

  const router = useRouter();

  const handleChartClick = () => {
    const userId = account?.accountId;
    router.push(`/report/${userId}`); // 추후 본인 childId로 수정
  };

  const handleCalendarClick = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    router.push(`/money-check/calendar?year=${year}&month=${month}`);
  };

  const handleFilterApply = (
    newStartDate: Date,
    newEndDate: Date,
    newType: TransactionFilterType,
    newDateRangeType: string
  ) => {
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
                <div className="flex items-center gap-2">
                  {isParent ? (
                    <ProfileImage image={user?.image} size="sm" />
                  ) : (
                    <Image src={Sprout} alt="sprout icon" className="size-7"></Image>
                  )}
                  <Link href={'/profile'}>
                    <div className="flex items-center space-x-1">
                      <p className="text-2xl font-bold">{user?.name} </p>
                      <p className="text-2xl font-medium">님</p>
                      <div className="size-7 rotate-180">
                        <Image src={Arrow} alt="arrow icon"></Image>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="flex space-x-2">
                  {!isParent && (
                    <Image src={ChartButton} alt="분석보기" onClick={handleChartClick} className="cursor-pointer" />
                  )}
                  {!isParent && (
                    <Image
                      src={CalendarButton}
                      alt="월별보기"
                      onClick={handleCalendarClick}
                      className="cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 유저상태 관리 방법 정해지면 컴포넌트 분리 수정 */}
            <div className="my-4 rounded-xl bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]">
              <div className="rounded-t-lg bg-yellow-300 p-2.5">
                <div className="flex items-center">
                  <ProfileImage image={user?.image} size="md" />
                  <div className="ml-5 font-light">
                    <p className="text-xl text-white">{account?.accountName}</p>
                    <p className="text-base text-white">{account?.accountNo}</p>
                  </div>
                </div>
              </div>
              <div className="py-4">
                <div className="text-center text-4xl font-bold">
                  {isLoading
                    ? '로딩 중...'
                    : account?.balance !== undefined
                      ? account.balance.toLocaleString()
                      : defaultAccountData.balance.toLocaleString()}
                  원
                </div>
              </div>
              <div className="flex justify-center rounded-b-lg bg-white pb-3">
                <Button
                  variant="primary"
                  size="md"
                  className="w-[220px]"
                  isFullWidth={false}
                  onClick={() => router.push('/transfer')}
                >
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

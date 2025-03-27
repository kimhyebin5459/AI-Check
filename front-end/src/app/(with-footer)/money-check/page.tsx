'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TransactionCard from '@/components/money-check/TransactionCard';

import { ChartButton, CalendarButton } from '@/public/icons';
import ProfileImage from '@/components/common/ProfileImage';

import { user } from '@/mocks/fixtures/user';
import { transactionData } from '@/mocks/fixtures/money-check';
import { account as accountData } from '@/mocks/fixtures/account';

import { TransactionGroup } from '@/types/money-check/transaction';
import { Account } from '@/types/common/account';

export default function Page() {
  const [account, setAccount] = useState<Account>();
  const [recentTransactions, setRecentTransactions] = useState<TransactionGroup[]>([]);

  useEffect(() => {
    // 데이터 로드 및 변환
    const loadTransactionData = () => {
      try {
        setRecentTransactions(transactionData as TransactionGroup[]);
      } catch (error) {
        console.error('트랜잭션 데이터 로드 실패:', error);
      }
    };

    const loadAccountData = () => {
      try {
        setAccount(accountData);
      } catch (error) {
        console.error('트랜잭션 데이터 로드 실패:', error);
      }
    }

    loadTransactionData();
    loadAccountData();
  }, []);

  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleChartClick = () => {
    router.push("/report/chart");
  };

  const handleCalendarClick = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    router.push(`/money-check/calendar?year=${year}&month=${month}`);
  };

  const handleFilterClick = () => {
    alert("필터 모달 오픈");
  };

  function formatDate(dateStr: string): string {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    const [year, month, day] = dateStr.split('-').map(part => parseInt(part, 10));
    
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
    <div className="flex flex-col h-screen">
      <Header title="용돈 기록장" />

      <main className="bg-white pb-16 m-5">
        <div>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center text-2xl cursor-pointer">
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

        <div className="my-4 bg-white rounded-xl shadow">
          <div className="p-2.5 bg-yellow-300 rounded-t-lg">
            <div className="flex items-center">
              <ProfileImage image={user.image} size='md' />
              <div className='font-light ml-5'>
                <p className="text-xl text-white">씨피뱅크 입출금 통장</p>
                <p className="text-base text-white">12-34567-89</p>
              </div>
            </div>
          </div>
          <div className="py-4">
            <div className="text-4xl font-bold text-center">
              {account?.balance && account.balance.toLocaleString()}원
            </div>
          </div>
          <div className="pb-3 bg-white rounded-b-lg flex justify-center">
            <Button
              variant="primary"
              size='md'
              className="w-[220px]"
              isFullWidth={false}
            >
              송금
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 flex justify-end items-center border-b border-gray-400">
            <div className='cursor-pointer' onClick={handleFilterClick}>
              <span className="font-medium">한달 | 전체 ▼</span>
            </div>
          </div>

          <div className="divide-y divide-gray-400">
            {recentTransactions.map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} className="py-2">
                <div className="px-4 py-2 text-2xl font-medium text-gray-600">
                  {formatDate(group.date)}
                </div>
                {group.records.map((record) => (
                  <TransactionCard
                    key={record.record_id}
                    {...record}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/footer/Footer';
import CalendarView from '@/components/calendar/CalendarView';
import TransactionHistory from '@/components/money-check/TransactionHistory';
import MonthSelector from '@/components/calendar/MonthSelector';
import Image from 'next/image';
import { Arrow } from '@/public/icons';

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentDate = new Date();

  const [year, setYear] = useState<number>(parseInt(searchParams.get('year') || currentDate.getFullYear().toString()));
  const [month, setMonth] = useState<number>(
    parseInt(searchParams.get('month') || (currentDate.getMonth() + 1).toString())
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState<boolean>(false);

  useEffect(() => {
    router.push(`/money-check/calendar?year=${year}&month=${month}`);
  }, [year, month, router]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const toggleMonthSelector = () => {
    setIsMonthSelectorOpen(!isMonthSelectorOpen);
  };

  const handleMonthSelect = (selectedYear: number, selectedMonth: number) => {
    setYear(selectedYear);
    setMonth(selectedMonth);
    setSelectedDate(new Date(selectedYear, selectedMonth - 1, 1));
    setIsMonthSelectorOpen(false);
  };

  const goToPreviousMonth = () => {
    let newYear = year;
    let newMonth = month;

    if (month === 1) {
      newYear = year - 1;
      newMonth = 12;
    } else {
      newMonth = month - 1;
    }

    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(new Date(newYear, newMonth - 1, 1));
  };

  const goToNextMonth = () => {
    let newYear = year;
    let newMonth = month;

    if (month === 12) {
      newYear = year + 1;
      newMonth = 1;
    } else {
      newMonth = month + 1;
    }

    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(new Date(newYear, newMonth - 1, 1));
  };

  const getStartOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const getEndOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };

  return (
    <div className="bg-gradation2 h-full pb-[5.5rem]">
      <div className="container">
        <Header title="월별 소비 확인" hasBackButton onBackClick={() => router.replace('/money-check')} />
        <main className="scrollbar-hide w-full overflow-y-auto p-5">
          <div className="mb-4 flex items-center justify-center gap-4">
            <button onClick={goToPreviousMonth} className="p-2">
              <Image alt="이전 월" src={Arrow} className="w-6" />
            </button>
            <button onClick={toggleMonthSelector} className="rounded-lg bg-yellow-200 px-4 py-2 text-lg font-medium">
              {year}년 {month}월
            </button>
            <button onClick={goToNextMonth} className="p-2">
              <Image alt="다음 월" src={Arrow} className="w-6 rotate-180" />
            </button>
          </div>

          <CalendarView year={year} month={month} onDateSelect={handleDateSelect} selectedDate={selectedDate} />

          <div className="mt-6">
            <TransactionHistory
              startDate={getStartOfDay(selectedDate)}
              endDate={getEndOfDay(selectedDate)}
              showFilterHeader={false}
            />
          </div>
        </main>
        <Footer />
      </div>

      {isMonthSelectorOpen && (
        <MonthSelector
          currentYear={year}
          currentMonth={month}
          onSelect={handleMonthSelect}
          onClose={() => setIsMonthSelectorOpen(false)}
        />
      )}
    </div>
  );
}

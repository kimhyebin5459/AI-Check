'use client';

import React from 'react';
import { CalendarResponse } from '@/types/calendar';

interface Props {
  calendarData: CalendarResponse;
}

export default function MonthlySummary({ calendarData }: Props) {
  console.log('calenda:', calendarData.calendar);

  const totalExpense = calendarData.expense;

  const totalIncome = calendarData.income;

  const total = calendarData.sum;

  return (
    <div className="my-4 flex justify-between rounded-lg bg-white p-4 shadow-md">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">총 지출</p>
        <p className="text-lg font-bold text-red-500">{Math.abs(totalExpense).toLocaleString()}원</p>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">총 수입</p>
        <p className="text-lg font-bold text-blue-500">{totalIncome.toLocaleString()}원</p>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">총합</p>
        <p className={`text-lg font-bold ${total >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
          {total.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}

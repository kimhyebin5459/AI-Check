'use client';

import React from 'react';

interface Props {
  day: number | null;
  date: Date | null;
  sum: number | null;
  active: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export default function CalendarDay({ day, date, sum, active, isSelected, onClick }: Props) {
  if (!active || day === null) {
    return <div className="aspect-square opacity-30" />;
  }

  // 요일에 따른 텍스트 색상 지정
  const getDayTextColor = (): string => {
    if (!date) return '';
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return 'text-red-500'; // 일요일
    if (dayOfWeek === 6) return 'text-blue-500'; // 토요일
    return 'text-gray-800';
  };

  return (
    <div className={`aspect-square cursor-pointer rounded-xl p-1 ${isSelected ? 'bg-gray-100' : ''}`} onClick={onClick}>
      <div className="flex h-full flex-col">
        <div className={`text-center text-lg font-medium ${getDayTextColor()}`}>{day}</div>

        {sum !== null && sum !== 0 && (
          <div className="-mt-1.5 text-center text-xs">
            <div
              className={`${sum > 0 ? 'bg-blue-100 text-blue-500' : 'bg-red-100 text-red-500'} font-April16thPromise mx-auto mt-0.5 rounded-full py-0.5 text-center font-thin`}
            >
              {Math.abs(sum).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

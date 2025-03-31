'use client';

import React, { useState } from 'react';
import Button from '../common/Button';

interface Props {
  currentYear: number;
  currentMonth: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}

export default function MonthSelector({ currentYear, currentMonth, onSelect, onClose }: Props) {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 3; i <= currentYear + 3; i++) {
      years.push(i);
    }
    return years;
  };

  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const years = generateYearOptions();
  const months = generateMonthOptions();

  const handleConfirm = () => {
    onSelect(selectedYear, selectedMonth);
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-80 rounded-lg bg-white p-4 shadow-lg">
        <div className="flex justify-between">
          <div className="w-1/2 pr-2">
            <h3 className="mb-2 text-center text-lg font-medium">연도</h3>
            <div className="max-h-40 overflow-y-auto">
              {years.map((year) => (
                <div
                  key={`year-${year}`}
                  className={`cursor-pointer rounded-xl p-2 text-center ${selectedYear === year ? 'bg-blue-100 font-bold' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2 pl-2">
            <h3 className="mb-2 text-center text-lg font-medium">월</h3>
            <div className="max-h-40 overflow-y-auto">
              {months.map((month) => (
                <div
                  key={`month-${month}`}
                  className={`cursor-pointer rounded-xl p-2 text-center ${selectedMonth === month ? 'bg-blue-100 font-bold' : ''}`}
                  onClick={() => setSelectedMonth(month)}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between gap-3">
          <Button onClick={onClose} variant="secondary">
            취소
          </Button>
          <Button onClick={handleConfirm}>확인</Button>
        </div>
      </div>
    </div>
  );
}

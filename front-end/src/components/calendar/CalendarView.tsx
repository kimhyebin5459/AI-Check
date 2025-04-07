'use client';

import React, { useState, useEffect } from 'react';
import { CalendarResponse, CalendarDay as CalendarDayType } from '@/types/calendar';
import CalendarDay from './CalendarDay';
import MonthlySummary from './MonthlySummary';
import { getCalendar } from '@/apis/moneycheck';

interface Props {
  year: number;
  month: number;
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export default function CalendarView({ year, month, onDateSelect, selectedDate }: Props) {
  const [calendarData, setCalendarData] = useState<CalendarResponse>({ calendar: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getCalendar(year, month);
        setCalendarData(data || { calendar: [] });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching calendar data:', errorMessage);
        setCalendarData({ calendar: [] });
      } finally {
        setLoading(false);
      }
    };

    void fetchCalendarData();
  }, [year, month]);

  const weekDays: readonly string[] = ['일', '월', '화', '수', '목', '금', '토'];

  const generateCalendarDays = (): CalendarDayType[] => {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const days: CalendarDayType[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, active: false, date: null, sum: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      const dayData = calendarData.calendar.find((item) => item.date === dateStr);

      days.push({
        day,
        active: true,
        date: new Date(year, month - 1, day),
        sum: dayData?.sum ?? null,
      });
    }

    return days;
  };

  const calendarDays: CalendarDayType[] = generateCalendarDays();

  const handleDateClick = (date: Date | null): void => {
    if (date !== null) {
      onDateSelect(date);
    }
  };

  const isSelectedDate = (date: Date | null): boolean => {
    if (date === null || !selectedDate) return false;

    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  const getDayTextColor = (dayIndex: number): string => {
    if (dayIndex === 0) return 'text-red-500';
    if (dayIndex === 6) return 'text-blue-500';
    return '';
  };

  return (
    <div>
      {!loading && !error && <MonthlySummary calendarData={calendarData} />}

      <div className="rounded-lg bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]">
        <div className="grid h-12 grid-cols-7 gap-1 rounded-t-lg bg-yellow-300">
          {weekDays.map((day, index) => (
            <div
              key={`weekday-${index}`}
              className={`flex items-center justify-center text-center text-xl font-semibold ${getDayTextColor(index)}`}
            >
              {day}
            </div>
          ))}
        </div>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p>로딩 중...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-500">
            <p>데이터를 불러오는 데 문제가 발생했습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1 pb-2">
            {calendarDays.map((dayObj, index) => (
              <CalendarDay
                key={`day-${index}`}
                day={dayObj.day}
                date={dayObj.date}
                sum={dayObj.sum}
                active={dayObj.active}
                isSelected={isSelectedDate(dayObj.date)}
                onClick={() => dayObj.active && handleDateClick(dayObj.date)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

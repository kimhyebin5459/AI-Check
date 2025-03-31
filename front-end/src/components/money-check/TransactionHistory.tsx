'use client';

import React, { useEffect, useState } from 'react';
import TransactionCard from '@/components/money-check/TransactionCard';
import { TransactionGroup } from '@/types/transaction';
import { formatDateToParam } from '@/utils/fotmatDate';

type Props = {
  startDate: Date;
  endDate: Date;
  type?: string;
  showFilterHeader?: boolean;
  onFilterClick?: () => void;
  customFilterText?: string;
};

export default function TransactionHistory({
  startDate,
  endDate,
  type = 'ALL',
  showFilterHeader = true,
  onFilterClick,
  customFilterText = '한달 | 전체 ▼',
}: Props) {
  const [transactions, setTransactions] = useState<TransactionGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactionData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/aicheck/transaction-records?startDate=${formatDateToParam(startDate)}&endDate=${formatDateToParam(endDate)}&type=${type}`
        );

        if (!response.ok) {
          throw new Error('API 호출 실패');
        }

        const result = await response.json();

        if (result.data && Array.isArray(result.data)) {
          setTransactions(result.data);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error('트랜잭션 데이터 로드 실패:', error);
        setError('거래 내역을 불러오는 데 실패했습니다.');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactionData();
  }, [startDate, endDate, type]);

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

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-4 text-center shadow-[0_0_20px_rgba(0,0,0,0.25)]">
        거래 내역을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-4 text-center text-red-500 shadow-[0_0_20px_rgba(0,0,0,0.25)]">{error}</div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]">
      {showFilterHeader && (
        <div className="flex items-center justify-end border-b border-gray-400 px-4 py-3">
          <div className="cursor-pointer" onClick={onFilterClick}>
            <span className="font-medium">{customFilterText}</span>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-400">
        {transactions.length > 0 ? (
          transactions.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`} className="py-2">
              <div className="px-4 py-2 text-2xl font-medium text-gray-600">{formatDate(group.date)}</div>
              {group.records.map((record) => (
                <TransactionCard key={record.recordId} {...record} />
              ))}
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">선택된 날짜의 거래 내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

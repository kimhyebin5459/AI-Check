'use client';
import Modal from '@/components/common/Modal';
import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Tag from '@/components/common/Tag';

import { formatDateToParam } from '@/utils/fotmatDate';
import { TransactionFilterType } from '@/types/transaction';

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
  onApply: (startDate: Date, endDate: Date, type: TransactionFilterType, dateRangeType: string) => void; // dateRangeType 추가
  initialStartDate: Date;
  initialEndDate: Date;
  initialType: TransactionFilterType;
  initialDateRangeType?: string;
}

export default function DateFilterModal({
  isModalOpen,
  onClose,
  onApply,
  initialStartDate,
  initialEndDate,
  initialType = 'ALL',
  initialDateRangeType = 'MONTH',
}: Props) {
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [endDate, setEndDate] = useState<Date>(initialEndDate);
  const [type, setType] = useState<TransactionFilterType>(initialType);
  const [dateRangeType, setDateRangeType] = useState<string>(initialDateRangeType);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(new Date(e.target.value));
    setDateRangeType('CUSTOM');
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(new Date(e.target.value));
    setDateRangeType('CUSTOM');
  };

  const setToday = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    setDateRangeType('TODAY');
  };

  const setWeekday = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    setStartDate(weekAgo);
    setEndDate(today);
    setDateRangeType('WEEK');
  };

  const setMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    setStartDate(startOfMonth);
    setEndDate(today);
    setDateRangeType('MONTH');
  };

  const setCustom = () => {
    setDateRangeType('CUSTOM');
  };

  const handleApply = () => {
    onApply(startDate, endDate, type, dateRangeType);
    onClose();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} position="bottom" title="기간·종류 선택">
      <div className="w-full space-y-6">
        <div className="flex flex-col space-y-4">
          <h3 className="text-base font-semibold">기간</h3>
          <div className="flex space-x-2">
            <Tag isSelected={dateRangeType === 'TODAY'} key={'TODAY'} size="xs" onClick={setToday}>
              오늘
            </Tag>
            <Tag isSelected={dateRangeType === 'WEEK'} key={'WEEK'} size="xs" onClick={setWeekday}>
              일주일
            </Tag>
            <Tag isSelected={dateRangeType === 'MONTH'} key={'MONTH'} size="xs" onClick={setMonth}>
              한달
            </Tag>
            <Tag isSelected={dateRangeType === 'CUSTOM'} key={'CUSTOM'} size="xs" onClick={setCustom}>
              직접 선택
            </Tag>
          </div>

          <div className="flex h-9 items-center justify-between rounded-xl border border-gray-200 px-3 tracking-tighter">
            <input
              type="date"
              className="border-none p-0 text-sm font-light outline-none"
              value={formatDateToParam(startDate)}
              onChange={handleStartDateChange}
            />
            <p className="text-gray-600">~</p>
            <input
              type="date"
              className="border-none p-0 text-sm font-light outline-none"
              value={formatDateToParam(endDate)}
              onChange={handleEndDateChange}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold">종류</h3>
          <div className="flex space-x-2">
            <Tag isSelected={type === 'ALL'} key={'ALL'} size="xs" onClick={() => setType('ALL')}>
              전체
            </Tag>
            <Tag isSelected={type === 'INCOME'} key={'INCOME'} size="xs" onClick={() => setType('INCOME')}>
              수입
            </Tag>
            <Tag isSelected={type === 'EXPENSE'} key={'EXPENSE'} size="xs" onClick={() => setType('EXPENSE')}>
              지출
            </Tag>
          </div>
        </div>

        <Button onClick={handleApply}>확인하기</Button>
      </div>
    </Modal>
  );
}

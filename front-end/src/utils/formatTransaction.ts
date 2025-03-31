import { TransactionType } from '@/types/transaction';
import React from 'react';
import { Bus, Tableware, Study, Enjoy, Living } from '@/public/icons';

export const getRatingText = (rating: number): string => {
  switch (rating) {
    case 1:
      return '아쉬워요';
    case 2:
      return '좋아요';
    case 3:
      return '최고예요';
    default:
      return '';
  }
};

export const getRatingEmoji = (rating: number): string => {
  switch (rating) {
    case 1:
      return '😢';
    case 2:
      return '😊';
    case 3:
      return '😍';
    default:
      return '';
  }
};

export const getTransactionTypeText = (type: TransactionType): string => {
  switch (type) {
    case 'PAYMENT':
      return '결제';
    case 'DEPOSIT':
      return '입금';
    case 'WITHDRAW':
      return '출금';
    case 'INBOUND_TRANSFER':
      return '입금 이체';
    case 'OUTBOUND_TRANSFER':
      return '출금 이체';
    default:
      return '';
  }
};

export const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    교통비: Bus,
    식비: Tableware,
    교육비: Study,
    여가비: Enjoy,
    생활비: Living,
  };

  return iconMap[category] || null;
};

export const getAmountDisplay = (type: TransactionType, amount: number): number => {
  if (type === 'DEPOSIT' || type === 'INBOUND_TRANSFER') {
    return +Math.abs(amount);
  } else {
    return -Math.abs(amount);
  }
};

export const getFilterText = (dateRangeType: string, transactionType: string): string => {
  let periodText = '';

  switch (dateRangeType) {
    case 'TODAY':
      periodText = '오늘';
      break;
    case 'WEEK':
      periodText = '일주일';
      break;
    case 'MONTH':
      periodText = '한달';
      break;
    case 'CUSTOM':
      periodText = '직접 선택';
      break;
    default:
      periodText = '한달';
  }

  let typeText = '';
  switch (transactionType) {
    case 'ALL':
      typeText = '전체';
      break;
    case 'INCOME':
      typeText = '수입';
      break;
    case 'EXPENSE':
      typeText = '지출';
      break;
    default:
      typeText = '전체';
  }

  return `${periodText} | ${typeText} ▼`;
};

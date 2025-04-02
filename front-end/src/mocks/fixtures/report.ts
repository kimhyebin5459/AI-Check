import { CategoryName } from '@/types/report';

export const reportSummary = {
  first: '간식',
  second: '택시',
  memoCount: 10,
  totalCount: 13,
};

export const categoryReport = {
  reportId: 1,
  totalAmount: 290000,
  report: [
    {
      name: '교통' as CategoryName,
      amount: 50000,
      secondCategory: [
        { name: '버스', amount: 15000 },
        { name: '지하철', amount: 20000 },
        { name: '택시', amount: 10000 },
        { name: '자전거', amount: 5000 },
      ],
    },
    {
      name: '식비' as CategoryName,
      amount: 120000,
      secondCategory: [
        { name: '식사', amount: 90000 },
        { name: '간식', amount: 15000 },
        { name: '음료', amount: 10000 },
        { name: '기타', amount: 5000 },
      ],
    },
    {
      name: '교육' as CategoryName,
      amount: 20000,
      secondCategory: [
        { name: '교재', amount: 5000 },
        { name: '문구', amount: 5000 },
        { name: '학용품', amount: 5000 },
        { name: '기타', amount: 5000 },
      ],
    },
    {
      name: '여가' as CategoryName,
      amount: 60000,
      secondCategory: [
        { name: '오락', amount: 25000 },
        { name: '여행', amount: 20000 },
        { name: '문화생활', amount: 10000 },
        { name: '기타', amount: 5000 },
      ],
    },
    {
      name: '생활' as CategoryName,
      amount: 50000,
      secondCategory: [
        { name: '의류', amount: 20000 },
        { name: '선물', amount: 15000 },
        { name: '생활용품', amount: 10000 },
        { name: '기타', amount: 5000 },
      ],
    },
  ],
};

export const peerReport = {
  reportId: 1,
  totalAmount: 310000,
  peer: [
    {
      name: '교통' as CategoryName,
      amount: 50000,
      peerAmount: 60000,
    },
    {
      name: '식비' as CategoryName,
      amount: 130000,
      peerAmount: 110000,
    },
    {
      name: '교육' as CategoryName,
      amount: 20000,
      peerAmount: 20000,
    },
    {
      name: '여가' as CategoryName,
      amount: 60000,
      peerAmount: 55000,
    },
    {
      name: '생활' as CategoryName,
      amount: 50000,
      peerAmount: 45000,
    },
  ],
};

import { CategoryName } from '@/types/report';

export const reportSummary = {
  first: '간식',
  second: '택시',
  memoCount: 10,
  totalCount: 13,
};

export const categoryReport = {
  id: '1',
  name: '아이1',
  year: 2025,
  month: 3,
  totalAmount: 290000,
  categories: [
    {
      firstCategoryId: 1,
      displayName: '교통' as CategoryName,
      amount: 50000,
      percentage: 17.24,
      subCategories: [
        { secondCategoryId: 101, displayName: '버스', amount: 15000, percentage: 30.0 },
        { secondCategoryId: 102, displayName: '지하철', amount: 20000, percentage: 40.0 },
        { secondCategoryId: 103, displayName: '택시', amount: 10000, percentage: 20.0 },
        { secondCategoryId: 104, displayName: '자전거', amount: 5000, percentage: 10.0 },
      ],
    },
    {
      firstCategoryId: 2,
      displayName: '식비' as CategoryName,
      amount: 120000,
      percentage: 41.38,
      subCategories: [
        { secondCategoryId: 201, displayName: '식사', amount: 90000, percentage: 75.0 },
        { secondCategoryId: 202, displayName: '간식', amount: 15000, percentage: 12.5 },
        { secondCategoryId: 203, displayName: '음료', amount: 10000, percentage: 8.33 },
        { secondCategoryId: 204, displayName: '기타', amount: 5000, percentage: 4.17 },
      ],
    },
    {
      firstCategoryId: 3,
      displayName: '교육' as CategoryName,
      amount: 20000,
      percentage: 6.9,
      subCategories: [
        { secondCategoryId: 301, displayName: '교재', amount: 5000, percentage: 25.0 },
        { secondCategoryId: 302, displayName: '문구', amount: 5000, percentage: 25.0 },
        { secondCategoryId: 303, displayName: '학용품', amount: 5000, percentage: 25.0 },
        { secondCategoryId: 304, displayName: '기타', amount: 5000, percentage: 25.0 },
      ],
    },
    {
      firstCategoryId: 4,
      displayName: '여가' as CategoryName,
      amount: 60000,
      percentage: 20.69,
      subCategories: [
        { secondCategoryId: 401, displayName: '오락', amount: 25000, percentage: 41.67 },
        { secondCategoryId: 402, displayName: '여행', amount: 20000, percentage: 33.33 },
        { secondCategoryId: 403, displayName: '문화생활', amount: 10000, percentage: 16.67 },
        { secondCategoryId: 404, displayName: '기타', amount: 5000, percentage: 8.33 },
      ],
    },
    {
      firstCategoryId: 5,
      displayName: '생활' as CategoryName,
      amount: 50000,
      percentage: 17.24,
      subCategories: [
        { secondCategoryId: 501, displayName: '의류', amount: 20000, percentage: 40.0 },
        { secondCategoryId: 502, displayName: '선물', amount: 15000, percentage: 30.0 },
        { secondCategoryId: 503, displayName: '생활용품', amount: 10000, percentage: 20.0 },
        { secondCategoryId: 504, displayName: '기타', amount: 5000, percentage: 10.0 },
      ],
    },
  ],
};

export const peerReport = {
  id: '67ef3402449230672a2453db',
  peerGroup: 'age_11_13',
  year: 2025,
  month: 3,
  totalAmount: 120000,
  categories: [
    {
      firstCategoryId: 1,
      displayName: '교통' as CategoryName,
      amount: 22000,
      percentage: 18.33,
      subCategories: [
        { secondCategoryId: 101, displayName: '버스', amount: 4500, percentage: 20.45 },
        { secondCategoryId: 102, displayName: '지하철', amount: 3000, percentage: 13.64 },
        { secondCategoryId: 103, displayName: '택시', amount: 3800, percentage: 17.27 },
        { secondCategoryId: 104, displayName: '자전거', amount: 4900, percentage: 22.27 },
        { secondCategoryId: 105, displayName: '기타', amount: 5300, percentage: 24.09 },
      ],
    },
    {
      firstCategoryId: 2,
      displayName: '식비' as CategoryName,
      amount: 25000,
      percentage: 20.83,
      subCategories: [
        { secondCategoryId: 201, displayName: '식사', amount: 6000, percentage: 24.0 },
        { secondCategoryId: 202, displayName: '간식', amount: 6500, percentage: 26.0 },
        { secondCategoryId: 203, displayName: '음료', amount: 5200, percentage: 20.8 },
        { secondCategoryId: 204, displayName: '기타', amount: 6300, percentage: 25.2 },
      ],
    },
    {
      firstCategoryId: 3,
      displayName: '교육' as CategoryName,
      amount: 23000,
      percentage: 19.17,
      subCategories: [
        { secondCategoryId: 301, displayName: '교재', amount: 7500, percentage: 32.61 },
        { secondCategoryId: 302, displayName: '문구', amount: 5300, percentage: 23.04 },
        { secondCategoryId: 303, displayName: '학용품', amount: 5100, percentage: 22.17 },
        { secondCategoryId: 304, displayName: '기타', amount: 5100, percentage: 22.17 },
      ],
    },
    {
      firstCategoryId: 4,
      displayName: '여가' as CategoryName,
      amount: 20000,
      percentage: 16.67,
      subCategories: [
        { secondCategoryId: 401, displayName: '오락', amount: 6800, percentage: 34.0 },
        { secondCategoryId: 402, displayName: '여행', amount: 3800, percentage: 19.0 },
        { secondCategoryId: 403, displayName: '문화생활', amount: 5200, percentage: 26.0 },
        { secondCategoryId: 404, displayName: '기타', amount: 4200, percentage: 21.0 },
      ],
    },
    {
      firstCategoryId: 5,
      displayName: '생활' as CategoryName,
      amount: 30000,
      percentage: 25.0,
      subCategories: [
        { secondCategoryId: 501, displayName: '의류', amount: 6000, percentage: 20.0 },
        { secondCategoryId: 502, displayName: '선물', amount: 8000, percentage: 26.67 },
        { secondCategoryId: 503, displayName: '생활용품', amount: 7500, percentage: 25.0 },
        { secondCategoryId: 504, displayName: '기타', amount: 8500, percentage: 28.33 },
      ],
    },
  ],
};

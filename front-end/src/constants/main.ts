import { Board, Devil, Duck, Money } from '@/public/icons';

export const PARENT_ITEM = {
  lines: ['자녀 관리'],
  image: Duck,
  color: 'yellow-200',
  to: '/manage-child',
};

export const CHILD_ITEM = {
  lines: ['엄마', '설득하기'],
  image: Duck,
  color: 'yellow-200',
  to: '/mother-ai',
};

export const COMMON_ITEM = [
  {
    lines: ['용돈', '요청 내역'],
    image: Board,
    color: 'gradation1',
    to: '/request',
  },
  {
    lines: ['우리 가족', '피싱 위험'],
    image: Devil,
    color: 'gradation1',
    to: '/phishing',
    caseCnt: 0,
  },
  {
    lines: ['송금하기'],
    image: Money,
    color: 'yellow-100',
    to: '/transfer',
  },
];

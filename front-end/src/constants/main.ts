export const PARENT_ITEM = {
  lines: ['자녀 관리'],
  image: '/images/duck.png',
  color: 'yellow-200',
  to: '/manage-child',
};

export const CHILD_ITEM = {
  lines: ['부모님께', '요청하기'],
  image: '/images/duck.png',
  color: 'yellow-200',
  to: '/mother-ai',
};

export const COMMON_ITEM = [
  {
    lines: ['용돈', '요청 내역'],
    image: '/images/board.png',
    color: 'gradation1',
    to: '/request',
  },
  {
    lines: ['우리 가족', '피싱 위험'],
    image: '/images/devil.png',
    color: 'gradation1',
    to: '/phishing',
    // caseCnt: 0,
  },
  {
    lines: ['송금하기'],
    image: '/images/money.png',
    color: 'yellow-100',
    to: '/transfer',
  },
];

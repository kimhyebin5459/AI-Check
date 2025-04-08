export const FIRST_CATEGORIES = ['교육', '교통', '생활', '음식', '여가'];

export const SECOND_CATEGORIES_MAP: Record<string, string[]> = {
  교통: ['버스', '지하철', '택시', '자전거', '기타'],
  음식: ['식사', '간식', '음료', '기타'],
  교육: ['교재', '학용품', '준비물', '기타'],
  여가: ['오락', '여행', '문화생활', '기타'],
  생활: ['의류', '선물', '생활용품', '기타'],
};

export const ALL_CATEGORIES = [
  {
    id: 1,
    displayName: '교통',
    secondCategories: [
      {
        id: 101,
        displayName: '버스',
      },
      {
        id: 102,
        displayName: '지하철',
      },
      {
        id: 103,
        displayName: '택시',
      },
      {
        id: 104,
        displayName: '자전거',
      },
      {
        id: 105,
        displayName: '기타',
      },
    ],
  },
  {
    id: 2,
    displayName: '음식',
    secondCategories: [
      {
        id: 201,
        displayName: '식사',
      },
      {
        id: 202,
        displayName: '간식',
      },
      {
        id: 203,
        displayName: '음료',
      },
      {
        id: 204,
        displayName: '기타',
      },
    ],
  },
  {
    id: 3,
    displayName: '교육',
    secondCategories: [
      {
        id: 301,
        displayName: '교재',
      },
      {
        id: 302,
        displayName: '문구',
      },
      {
        id: 303,
        displayName: '학용품',
      },
      {
        id: 304,
        displayName: '기타',
      },
    ],
  },
  {
    id: 4,
    displayName: '여가',
    secondCategories: [
      {
        id: 401,
        displayName: '오락',
      },
      {
        id: 402,
        displayName: '여행',
      },
      {
        id: 403,
        displayName: '문화생활',
      },
      {
        id: 404,
        displayName: '기타',
      },
    ],
  },
  {
    id: 5,
    displayName: '생활',
    secondCategories: [
      {
        id: 501,
        displayName: '의류',
      },
      {
        id: 502,
        displayName: '선물',
      },
      {
        id: 503,
        displayName: '생활용품',
      },
      {
        id: 504,
        displayName: '기타',
      },
    ],
  },
];

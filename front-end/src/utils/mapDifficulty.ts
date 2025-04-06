export const difficultyMapping: Record<string, string> = {
  EASY: '쉬움',
  NORMAL: '중간',
  HARD: '어려움',
  CUSTOM: '커스텀',
};

export const difficultyReverseMapping: Record<string, string> = {
  쉬움: 'EASY',
  중간: 'NORMAL',
  어려움: 'HARD',
  커스텀: 'CUSTOM',
};

export const categoryMapping: Record<string, string> = {
  TRANSPORTATION: '교통',
  FOOD: '식비',
  EDUCATION: '교육',
  LEISURE: '여가',
  LIVING: '생활',
};

export const categoryReverseMapping: Record<string, string> = {
  교통: 'TRANSPORTATION',
  식비: 'FOOD',
  교육: 'EDUCATION',
  여가: 'LEISURE',
  생활: 'LIVING',
};

export const subCategoryMapping: Record<string, string> = {
  BUS: '버스',
  SUBWAY: '지하철',
  TAXI: '택시',
  BICYCLE: '자전거',
  OTHER: '기타',
  MEAL: '식사',
  SNACK: '간식',
  BEVERAGE: '음료',
  TEXTBOOK: '교재',
  STATIONERY: '학용품',
  SUPPLY: '준비물',
  ENTERTAINMENT: '오락',
  TRAVEL: '여행',
  CULTURE: '문화생활',
  CLOTHING: '의류',
  GIFT: '선물',
  HOUSEITEM: '생활용품',
};

export const subCategoryReverseMapping: Record<string, string> = {
  버스: 'BUS',
  지하철: 'SUBWAY',
  택시: 'TAXI',
  자전거: 'BICYCLE',
  기타: 'OTHER',
  식사: 'MEAL',
  간식: 'SNACK',
  음료: 'BEVERAGE',
  교재: 'TEXTBOOK',
  학용품: 'STATIONERY',
  준비물: 'SUPPLY',
  오락: 'ENTERTAINMENT',
  여행: 'TRAVEL',
  문화생활: 'CULTURE',
  의류: 'CLOTHING',
  선물: 'GIFT',
  생활용품: 'HOUSEITEM',
};

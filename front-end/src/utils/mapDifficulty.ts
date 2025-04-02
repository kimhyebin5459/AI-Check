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
  TRANSPORTATION: '교통비',
  FOOD: '식비',
  EDUCATION: '교육비',
  LEISURE: '여가비',
  LIVING: '생활비',
};

export const categoryReverseMapping: Record<string, string> = {
  교통비: 'TRANSPORTATION',
  식비: 'FOOD',
  교육비: 'EDUCATION',
  여가비: 'LEISURE',
  생활비: 'LIVING',
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
  TEXTBOOK: '교재비',
  STATIONERY: '학용품비',
  SUPPLY: '준비물',
  ENTERTAINMENT: '오락비',
  TRAVEL: '여행비',
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
  교재비: 'TEXTBOOK',
  학용품비: 'STATIONERY',
  준비물: 'SUPPLY',
  오락비: 'ENTERTAINMENT',
  여행비: 'TRAVEL',
  문화생활: 'CULTURE',
  의류: 'CLOTHING',
  선물: 'GIFT',
  생활용품: 'HOUSEITEM',
};

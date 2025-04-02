// 자녀 프로필 타입 정의
export interface ChildProfile {
  childId: number;
  image: string;
  name: string;
}

// 자녀 프로필 목 데이터
export const childProfiles: ChildProfile[] = [
  {
    childId: 2,
    name: '아이1',
    image: 'https://www.shutterstock.com/image-illustration/3d-cute-girl-happy-pose-260nw-2399125661.jpg',
  },
  {
    childId: 3,
    name: '아이2',
    image: 'https://www.shutterstock.com/image-illustration/3d-cute-kid-give-ok-260nw-2395161169.jpg',
  },
  {
    childId: 4,
    name: '아이3',
    image: 'https://www.shutterstock.com/image-illustration/3d-cute-girl-happy-pose-260nw-2399125661.jpg',
  },
  {
    childId: 5,
    name: '아이4',
    image: 'https://www.shutterstock.com/image-illustration/3d-cute-boy-glasses-school-uniform-2395161172.jpg',
  },
];

// 난이도 타입 정의
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'CUSTOM';

// 서브 카테고리 타입 정의
export interface SubCategory {
  subCategoryId: number;
  subCategoryName: string;
  difficulty: Difficulty;
}

// 카테고리 타입 정의
export interface Category {
  categoryId: number;
  categoryName: string;
  subCategories: SubCategory[];
}

// 자녀별 챗봇 난이도 설정 타입
export interface ChatbotDifficulty {
  categoryDifficulties: Category[];
}

// 기본 난이도 설정 데이터
const defaultChatbotDifficulty: ChatbotDifficulty = {
  categoryDifficulties: [
    {
      categoryId: 1,
      categoryName: 'TRANSPORTATION',
      subCategories: [
        { subCategoryId: 101, subCategoryName: 'BUS', difficulty: 'EASY' },
        { subCategoryId: 102, subCategoryName: 'SUBWAY', difficulty: 'NORMAL' },
        { subCategoryId: 103, subCategoryName: 'TAXI', difficulty: 'HARD' },
        { subCategoryId: 104, subCategoryName: 'BICYCLE', difficulty: 'EASY' },
        { subCategoryId: 105, subCategoryName: 'OTHER', difficulty: 'NORMAL' },
      ],
    },
    {
      categoryId: 2,
      categoryName: 'FOOD',
      subCategories: [
        { subCategoryId: 201, subCategoryName: 'MEAL', difficulty: 'NORMAL' },
        { subCategoryId: 202, subCategoryName: 'SNACK', difficulty: 'EASY' },
        { subCategoryId: 203, subCategoryName: 'BEVERAGE', difficulty: 'EASY' },
        { subCategoryId: 204, subCategoryName: 'OTHER', difficulty: 'NORMAL' },
      ],
    },
    {
      categoryId: 3,
      categoryName: 'EDUCATION',
      subCategories: [
        { subCategoryId: 301, subCategoryName: 'TEXTBOOK', difficulty: 'NORMAL' },
        { subCategoryId: 302, subCategoryName: 'STATIONERY', difficulty: 'EASY' },
        { subCategoryId: 303, subCategoryName: 'SUPPLY', difficulty: 'NORMAL' },
        { subCategoryId: 304, subCategoryName: 'OTHER', difficulty: 'HARD' },
      ],
    },
    {
      categoryId: 4,
      categoryName: 'LEISURE',
      subCategories: [
        { subCategoryId: 401, subCategoryName: 'ENTERTAINMENT', difficulty: 'NORMAL' },
        { subCategoryId: 402, subCategoryName: 'TRAVEL', difficulty: 'HARD' },
        { subCategoryId: 403, subCategoryName: 'CULTURE', difficulty: 'NORMAL' },
        { subCategoryId: 404, subCategoryName: 'OTHER', difficulty: 'HARD' },
      ],
    },
    {
      categoryId: 5,
      categoryName: 'LIVING',
      subCategories: [
        { subCategoryId: 501, subCategoryName: 'CLOTHING', difficulty: 'NORMAL' },
        { subCategoryId: 502, subCategoryName: 'GIFT', difficulty: 'HARD' },
        { subCategoryId: 503, subCategoryName: 'HOUSEITEM', difficulty: 'NORMAL' },
        { subCategoryId: 504, subCategoryName: 'OTHER', difficulty: 'HARD' },
      ],
    },
  ],
};

// 자녀별 챗봇 난이도 설정 데이터
export const childChatbotDifficulties: Record<number, ChatbotDifficulty> = {
  1: { ...defaultChatbotDifficulty },
  2: {
    categoryDifficulties: [
      {
        categoryId: 1,
        categoryName: 'TRANSPORTATION',
        subCategories: [
          { subCategoryId: 101, subCategoryName: 'BUS', difficulty: 'NORMAL' },
          { subCategoryId: 102, subCategoryName: 'SUBWAY', difficulty: 'NORMAL' },
          { subCategoryId: 103, subCategoryName: 'TAXI', difficulty: 'HARD' },
          { subCategoryId: 104, subCategoryName: 'BICYCLE', difficulty: 'EASY' },
          { subCategoryId: 105, subCategoryName: 'OTHER', difficulty: 'NORMAL' },
        ],
      },
      {
        categoryId: 2,
        categoryName: 'FOOD',
        subCategories: [
          { subCategoryId: 201, subCategoryName: 'MEAL', difficulty: 'HARD' },
          { subCategoryId: 202, subCategoryName: 'SNACK', difficulty: 'NORMAL' },
          { subCategoryId: 203, subCategoryName: 'BEVERAGE', difficulty: 'EASY' },
          { subCategoryId: 204, subCategoryName: 'OTHER', difficulty: 'NORMAL' },
        ],
      },
      {
        categoryId: 3,
        categoryName: 'EDUCATION',
        subCategories: [
          { subCategoryId: 301, subCategoryName: 'TEXTBOOK', difficulty: 'EASY' },
          { subCategoryId: 302, subCategoryName: 'STATIONERY', difficulty: 'EASY' },
          { subCategoryId: 303, subCategoryName: 'SUPPLY', difficulty: 'EASY' },
          { subCategoryId: 304, subCategoryName: 'OTHER', difficulty: 'EASY' },
        ],
      },
      {
        categoryId: 4,
        categoryName: 'LEISURE',
        subCategories: [
          { subCategoryId: 401, subCategoryName: 'ENTERTAINMENT', difficulty: 'HARD' },
          { subCategoryId: 402, subCategoryName: 'TRAVEL', difficulty: 'HARD' },
          { subCategoryId: 403, subCategoryName: 'CULTURE', difficulty: 'NORMAL' },
          { subCategoryId: 404, subCategoryName: 'OTHER', difficulty: 'HARD' },
        ],
      },
      {
        categoryId: 5,
        categoryName: 'LIVING',
        subCategories: [
          { subCategoryId: 501, subCategoryName: 'CLOTHING', difficulty: 'NORMAL' },
          { subCategoryId: 502, subCategoryName: 'GIFT', difficulty: 'NORMAL' },
          { subCategoryId: 503, subCategoryName: 'HOUSEITEM', difficulty: 'NORMAL' },
          { subCategoryId: 504, subCategoryName: 'OTHER', difficulty: 'NORMAL' },
        ],
      },
    ],
  },
  3: { ...defaultChatbotDifficulty },
  4: { ...defaultChatbotDifficulty },
};

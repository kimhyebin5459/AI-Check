// 난이도 타입 정의
export type ApiDifficulty = 'EASY' | 'NORMAL' | 'HARD' | 'CUSTOM';
export type DisplayDifficulty = '쉬움' | '중간' | '어려움' | '커스텀';

// 서브 카테고리 타입 정의
export interface SubCategory {
  subCategoryId: number;
  subCategoryName: string;
  difficulty: ApiDifficulty;
}

// 카테고리 타입 정의
export interface Category {
  categoryId: number;
  categoryName: string;
  subCategories: SubCategory[];
}

// 자녀별 챗봇 난이도 설정 타입
export interface ChatbotDifficulty {
  childId: number;
  categoryDifficulties: Category[];
  content: string;
}

// 난이도 매핑 관련 상수 및 유틸리티 함수
export const DIFFICULTY_MAP: Record<ApiDifficulty | DisplayDifficulty, ApiDifficulty | DisplayDifficulty> = {
  EASY: '쉬움',
  NORMAL: '중간',
  HARD: '어려움',
  CUSTOM: '커스텀',
  쉬움: 'EASY',
  중간: 'NORMAL',
  어려움: 'HARD',
  커스텀: 'CUSTOM',
};

export const toDisplayDifficulty = (apiDifficulty: string): DisplayDifficulty => {
  return (DIFFICULTY_MAP[apiDifficulty as ApiDifficulty] as DisplayDifficulty) || '중간';
};

export const toApiDifficulty = (displayDifficulty: string): ApiDifficulty => {
  return (DIFFICULTY_MAP[displayDifficulty as DisplayDifficulty] as ApiDifficulty) || 'NORMAL';
};

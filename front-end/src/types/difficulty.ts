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

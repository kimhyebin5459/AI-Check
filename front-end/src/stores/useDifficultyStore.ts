import { create } from 'zustand';
import { getChatbotDifficulty, updateChatbotDifficulty, copyChatbotDifficulty } from '@/apis/custom';
import {
  SubCategory,
  Category,
  ChatbotDifficulty,
  DisplayDifficulty,
  toApiDifficulty,
  toDisplayDifficulty,
} from '@/types/difficulty';

interface DifficultyState {
  difficultyData: ChatbotDifficulty | null;
  categoryDifficulties: Record<string, DisplayDifficulty>;
  expandedCategories: Record<string, boolean>;
  loading: boolean;
  error: string | null;
  childId: string | null;
  content: string | null; // content 추가

  setChildId: (childId: string) => void;
  clearError: () => void;
  toggleCategory: (category: string) => void;
  handleDifficultyChange: (category: string, difficulty: DisplayDifficulty) => void;
  handleSubCategoryDifficultyChange: (
    parentCategory: string,
    subCategoryId: number,
    difficulty: DisplayDifficulty
  ) => void;
  setContent: (content: string) => void; // setContent 함수 추가
  fetchDifficultySettings: () => Promise<void>;
  saveSettings: () => Promise<boolean>;
  copySettingsFromChild: (sourceChildId: string) => Promise<void>;
}

const areAllSameDifficulty = (subCategories: SubCategory[]): boolean => {
  if (!subCategories || subCategories.length === 0) return true;
  const firstDifficulty = subCategories[0].difficulty;
  return subCategories.every((sub) => sub.difficulty === firstDifficulty);
};

export const useDifficultyStore = create<DifficultyState>((set, get) => ({
  difficultyData: null,
  categoryDifficulties: {},
  expandedCategories: {},
  loading: false,
  error: null,
  childId: null,
  content: null, // content 초기값

  setChildId: (childId: string) => set({ childId }),

  clearError: () => set({ error: null }),

  toggleCategory: (category: string) =>
    set((state) => ({
      expandedCategories: {
        ...state.expandedCategories,
        [category]: !state.expandedCategories[category],
      },
    })),

  setContent: (content: string) => set({ content }), // content setter 함수 추가

  handleDifficultyChange: (category: string, difficulty: DisplayDifficulty) => {
    const { difficultyData } = get();
    if (!difficultyData) return;

    set((state) => ({
      categoryDifficulties: {
        ...state.categoryDifficulties,
        [category]: difficulty,
      },
      expandedCategories: {
        ...state.expandedCategories,
        [category]: difficulty === '커스텀',
      },
    }));

    const categoryIndex = difficultyData.categoryDifficulties.findIndex((cat) => cat.categoryName === category);

    if (categoryIndex === -1) {
      console.log(`Category "${category}" not found in difficulty data`);
      return;
    }

    const apiDifficulty = toApiDifficulty(difficulty);
    const updatedData = JSON.parse(JSON.stringify(difficultyData)); // 깊은 복사

    updatedData.categoryDifficulties[categoryIndex].subCategories = updatedData.categoryDifficulties[
      categoryIndex
    ].subCategories.map((sub: SubCategory) => ({
      ...sub,
      difficulty: apiDifficulty === 'CUSTOM' ? sub.difficulty : apiDifficulty,
    }));

    set({ difficultyData: updatedData });
  },

  handleSubCategoryDifficultyChange: (parentCategory: string, subCategoryId: number, difficulty: DisplayDifficulty) => {
    const { difficultyData } = get();
    if (!difficultyData) return;

    const apiDifficulty = toApiDifficulty(difficulty);

    const categoryIndex = difficultyData.categoryDifficulties.findIndex((cat) => cat.categoryName === parentCategory);

    if (categoryIndex === -1) {
      console.error(`Parent category "${parentCategory}" not found`);
      return;
    }

    const updatedData = JSON.parse(JSON.stringify(difficultyData));
    const subIndex = updatedData.categoryDifficulties[categoryIndex].subCategories.findIndex(
      (sub: SubCategory) => sub.subCategoryId === subCategoryId
    );

    if (subIndex === -1) {
      console.error(`SubCategory with ID ${subCategoryId} not found in ${parentCategory}`);
      return;
    }

    updatedData.categoryDifficulties[categoryIndex].subCategories[subIndex].difficulty = apiDifficulty;

    set((state) => ({
      difficultyData: updatedData,
      categoryDifficulties: {
        ...state.categoryDifficulties,
        [parentCategory]: '커스텀',
      },
      expandedCategories: {
        ...state.expandedCategories,
        [parentCategory]: true,
      },
    }));
  },

  fetchDifficultySettings: async () => {
    const { childId } = get();
    if (!childId) return;

    set({ loading: true, error: null });

    try {
      const data = await getChatbotDifficulty(Number(childId));

      const difficultyMap: Record<string, DisplayDifficulty> = {};
      const initialExpandedState: Record<string, boolean> = {};

      data.categoryDifficulties.forEach((category) => {
        const categoryName = category.categoryName;

        if (areAllSameDifficulty(category.subCategories) && category.subCategories.length > 0) {
          difficultyMap[categoryName] = toDisplayDifficulty(category.subCategories[0].difficulty);
        } else {
          difficultyMap[categoryName] = '커스텀';
        }

        initialExpandedState[categoryName] = false;
      });

      set({
        difficultyData: data,
        categoryDifficulties: difficultyMap,
        expandedCategories: initialExpandedState,
        content: data.content || '', // content 설정
        loading: false,
      });
    } catch (err) {
      console.error('Error fetching settings:', err);
      set({
        error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  saveSettings: async () => {
    const { difficultyData, content } = get();
    console.log('setting log:', difficultyData);

    if (!difficultyData) return false;

    // content 필드 업데이트
    const updatedDifficultyData = {
      ...difficultyData,
      content: content || '',
    };

    try {
      await updateChatbotDifficulty({
        difficulty: updatedDifficultyData,
      });

      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      set({
        error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
      });
      throw err;
    }
  },

  copySettingsFromChild: async (sourceChildId: string) => {
    const { childId } = get();
    if (!childId) return;

    set({ loading: true, error: null });

    try {
      const result = await copyChatbotDifficulty({
        targetChildId: Number(childId),
        sourceChildId: Number(sourceChildId),
      });

      const difficultyMap: Record<string, DisplayDifficulty> = {};
      const initialExpandedState: Record<string, boolean> = {};

      result.categoryDifficulties.forEach((category: Category) => {
        const categoryName = category.categoryName;

        if (areAllSameDifficulty(category.subCategories) && category.subCategories.length > 0) {
          difficultyMap[categoryName] = toDisplayDifficulty(category.subCategories[0].difficulty);
        } else {
          difficultyMap[categoryName] = '커스텀';
        }

        initialExpandedState[categoryName] = false;
      });

      set({
        difficultyData: result,
        categoryDifficulties: difficultyMap,
        expandedCategories: initialExpandedState,
        content: result.content || '', // content 설정
        loading: false,
      });
    } catch (err) {
      console.error('Error copying settings:', err);
      set({
        error: err instanceof Error ? err.message : '소스 자녀의 설정을 불러오는데 실패했습니다.',
        loading: false,
      });
      throw err;
    }
  },
}));

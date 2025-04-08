'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
  difficultyMapping,
  difficultyReverseMapping,
  categoryMapping,
  categoryReverseMapping,
} from '@/utils/mapDifficulty';
import { getChatbotDifficulty, updateChatbotDifficulty, copyChatbotDifficulty } from '@/apis/custom';
import { SubCategory, Category, ChatbotDifficulty } from '@/types/difficulty';

interface DifficultyContextType {
  // 상태
  difficultyData: ChatbotDifficulty | null;
  categoryDifficulties: Record<string, string>;
  expandedCategories: Record<string, boolean>;
  loading: boolean;
  error: string | null;

  // 함수
  clearError: () => void;
  toggleCategory: (category: string) => void;
  handleDifficultyChange: (category: string, difficulty: string) => void;
  handleSubCategoryDifficultyChange: (subCategoryName: string, difficulty: string) => void;
  saveSettings: () => Promise<boolean>;
  copySettingsFromChild: (sourceChildId: string) => Promise<void>;
}

// Context 생성
export const DifficultyContext = createContext<DifficultyContextType | undefined>(undefined);

// Provider 컴포넌트
export function DifficultyProvider({ children, childId }: { children: ReactNode; childId: string }) {
  const [difficultyData, setDifficultyData] = useState<ChatbotDifficulty | null>(null);
  const [categoryDifficulties, setCategoryDifficulties] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // 모든 서브카테고리가 같은 난이도인지 확인하는 함수
  const areAllSameDifficulty = (subCategories: SubCategory[]): boolean => {
    if (!subCategories || subCategories.length === 0) return true;
    const firstDifficulty = subCategories[0].difficulty;
    return subCategories.every((sub) => sub.difficulty === firstDifficulty);
  };

  // 난이도 설정 데이터 로드
  useEffect(() => {
    const fetchDifficultySettings = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getChatbotDifficulty(Number(childId));
        setDifficultyData(data);
        console.log('loadedData:', data);

        // 카테고리별 난이도 초기화
        const difficultyMap: Record<string, string> = {};
        const initialExpandedState: Record<string, boolean> = {};

        data.categoryDifficulties.forEach((category) => {
          const koreanCategoryName = categoryMapping[category.categoryName] || category.categoryName;

          // 모든 서브카테고리가 같은 난이도인지 확인
          if (areAllSameDifficulty(category.subCategories)) {
            difficultyMap[koreanCategoryName] = difficultyMapping[category.subCategories[0].difficulty] || '중간';
          } else {
            difficultyMap[koreanCategoryName] = '커스텀';
          }

          // 모든 카테고리를 처음에는 닫힌 상태로 설정
          initialExpandedState[koreanCategoryName] = false;
        });

        setCategoryDifficulties(difficultyMap);
        setExpandedCategories(initialExpandedState);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDifficultySettings();
  }, [childId]);

  // 카테고리 펼치기/접기 토글
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // 카테고리 난이도 변경
  const handleDifficultyChange = (category: string, difficulty: string) => {
    if (!difficultyData) return;

    setCategoryDifficulties((prev) => ({
      ...prev,
      [category]: difficulty,
    }));

    // 난이도가 '커스텀'으로 변경되면 카테고리를 펼치고, 아니면 접기
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: difficulty === '커스텀',
    }));

    const apiCategoryName = categoryReverseMapping[category] || category;
    const categoryIndex = difficultyData.categoryDifficulties.findIndex((cat) => cat.categoryName === apiCategoryName);

    if (categoryIndex === -1) return;

    // 새 난이도로 모든 서브 카테고리 업데이트
    const apiDifficulty = difficultyReverseMapping[difficulty] || difficulty;
    const updatedData = JSON.parse(JSON.stringify(difficultyData)); // 깊은 복사

    updatedData.categoryDifficulties[categoryIndex].subCategories = updatedData.categoryDifficulties[
      categoryIndex
    ].subCategories.map((sub: SubCategory) => ({
      ...sub,
      difficulty: apiDifficulty === 'CUSTOM' ? sub.difficulty : apiDifficulty,
    }));

    setDifficultyData(updatedData);
  };

  // 서브카테고리 난이도 변경
  const handleSubCategoryDifficultyChange = (subCategoryName: string, difficulty: string) => {
    if (!difficultyData) return;

    // API 형식으로 난이도 변환
    const apiDifficulty = difficultyReverseMapping[difficulty] || 'MEDIUM';

    // 이 서브카테고리가 어떤 카테고리에 속하는지 찾기
    let categoryFound = false;
    const updatedData = JSON.parse(JSON.stringify(difficultyData));

    for (let i = 0; i < updatedData.categoryDifficulties.length; i++) {
      const category = updatedData.categoryDifficulties[i];
      const subIndex = category.subCategories.findIndex((sub: SubCategory) => sub.subCategoryName === subCategoryName);

      if (subIndex !== -1) {
        // 서브 카테고리 난이도 업데이트
        updatedData.categoryDifficulties[i].subCategories[subIndex].difficulty = apiDifficulty;

        // 한글 카테고리 이름 찾기
        const koreanCategoryName = categoryMapping[category.categoryName] || category.categoryName;

        // 부모 카테고리의 난이도를 '커스텀'으로 설정
        setCategoryDifficulties((prev) => ({
          ...prev,
          [koreanCategoryName]: '커스텀',
        }));

        // 카테고리 펼치기
        setExpandedCategories((prev) => ({
          ...prev,
          [koreanCategoryName]: true,
        }));

        categoryFound = true;
        break;
      }
    }

    if (categoryFound) {
      setDifficultyData(updatedData);
    }
  };

  // 설정 저장
  const saveSettings = async (): Promise<boolean> => {
    console.log('setting log:', difficultyData);

    if (!difficultyData) return false;
    if (difficultyData?.content == null) difficultyData.content = '';

    try {
      await updateChatbotDifficulty({
        difficulty: difficultyData,
      });

      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      throw err;
    }
  };

  // 다른 자녀의 설정 복사
  const copySettingsFromChild = async (sourceChildId: string): Promise<void> => {
    try {
      const result = await copyChatbotDifficulty({
        targetChildId: Number(childId),
        sourceChildId: Number(sourceChildId),
      });

      // 복사된 결과를 화면에 적용
      setDifficultyData(result);

      // 카테고리별 난이도 초기화
      const difficultyMap: Record<string, string> = {};
      const initialExpandedState: Record<string, boolean> = {};

      result.categoryDifficulties.forEach((category: Category) => {
        const koreanCategoryName = categoryMapping[category.categoryName] || category.categoryName;

        if (areAllSameDifficulty(category.subCategories)) {
          difficultyMap[koreanCategoryName] = difficultyMapping[category.subCategories[0].difficulty] || '중간';
        } else {
          difficultyMap[koreanCategoryName] = '커스텀';
        }

        initialExpandedState[koreanCategoryName] = false;
      });

      setCategoryDifficulties(difficultyMap);
      setExpandedCategories(initialExpandedState);
    } catch (err) {
      console.error('Error copying settings:', err);
      setError(err instanceof Error ? err.message : '소스 자녀의 설정을 불러오는데 실패했습니다.');
      throw err;
    }
  };

  // Context 값 정의
  const value = {
    difficultyData,
    categoryDifficulties,
    expandedCategories,
    loading,
    error,
    clearError,
    toggleCategory,
    handleDifficultyChange,
    handleSubCategoryDifficultyChange,
    saveSettings,
    copySettingsFromChild,
  };

  return <DifficultyContext.Provider value={value}>{children}</DifficultyContext.Provider>;
}

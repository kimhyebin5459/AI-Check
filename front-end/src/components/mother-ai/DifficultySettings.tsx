'use client';

import React from 'react';
import Spinner from '@/components/common/Spinner';
import CategoryCard from '@/components/mother-ai/CategoryCard';
import { categoryMapping } from '@/utils/mapDifficulty';
import { useDifficultyStore } from '@/stores/useDifficultyStore';
import { DisplayDifficulty } from '@/types/difficulty';
import ErrorComponent from '@/app/_components/error-component';

export default function DifficultySettings() {
  const {
    difficultyData,
    categoryDifficulties,
    expandedCategories,
    loading,
    error,
    toggleCategory,
    handleDifficultyChange,
  } = useDifficultyStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-500">{error}</div>;
  }

  if (!difficultyData) {
    return <ErrorComponent subMessage="설정을 불러올 수 없습니다." />;
  }

  const defaultDifficulty: DisplayDifficulty = '중간';

  return (
    <div className="space-y-4">
      {difficultyData.categoryDifficulties.map((category) => {
        const koreanCategoryName = categoryMapping[category.categoryName] || category.categoryName;

        const currentDifficulty = (categoryDifficulties[koreanCategoryName] || defaultDifficulty) as DisplayDifficulty;
        const isExpanded = expandedCategories[koreanCategoryName] || false;

        return (
          <CategoryCard
            key={category.categoryId}
            category={category}
            koreanCategoryName={koreanCategoryName}
            currentDifficulty={currentDifficulty}
            isExpanded={isExpanded}
            onToggle={() => toggleCategory(koreanCategoryName)}
            onDifficultyChange={(difficulty) => handleDifficultyChange(koreanCategoryName, difficulty)}
          />
        );
      })}
    </div>
  );
}

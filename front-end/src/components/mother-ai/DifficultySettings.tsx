'use client';

import React from 'react';
import Spinner from '@/components/common/Spinner';
import CategoryCard from '@/components/mother-ai/CategoryCard';
import { useDifficultySettings } from '@/contexts/DifficultyContext';
import { categoryMapping } from '@/utils/mapDifficulty';

export default function DifficultySettings() {
  const {
    difficultyData,
    categoryDifficulties,
    expandedCategories,
    loading,
    error,
    toggleCategory,
    handleDifficultyChange,
  } = useDifficultySettings();

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
    return (
      <div className="rounded-lg border border-gray-200 p-4 text-center text-gray-500">설정을 불러올 수 없습니다.</div>
    );
  }

  return (
    <div className="space-y-4">
      {difficultyData.categoryDifficulties.map((category) => {
        const koreanCategoryName = categoryMapping[category.categoryName] || category.categoryName;
        const currentDifficulty = categoryDifficulties[koreanCategoryName] || '중간';
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

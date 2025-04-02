'use client';

import React from 'react';
import Tag from '@/components/common/Tag';
import SubCategorySection from './SubCategorySection';

// 난이도 정의
const DIFFICULTY_OPTIONS = ['쉬움', '중간', '어려움', '커스텀'] as const;

interface SubCategory {
  subCategoryId: number;
  subCategoryName: string;
  difficulty: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
  subCategories: SubCategory[];
}

interface Props {
  category: Category;
  koreanCategoryName: string;
  currentDifficulty: string;
  isExpanded: boolean;
  onToggle: () => void;
  onDifficultyChange: (difficulty: string) => void;
}

export default function CategoryCard({
  category,
  koreanCategoryName,
  currentDifficulty,
  isExpanded,
  onToggle,
  onDifficultyChange,
}: Props) {
  const showExpandIcon = currentDifficulty === '커스텀';

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="cursor-pointer items-center justify-between p-4" onClick={() => showExpandIcon && onToggle()}>
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-semibold">{koreanCategoryName}</h3>
          {showExpandIcon && (
            <svg
              className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex w-full space-x-2">
            {DIFFICULTY_OPTIONS.map((difficulty) => {
              const handleTagClick = () => {
                setTimeout(() => {
                  onDifficultyChange(difficulty);
                }, 0);
              };

              return (
                <Tag
                  key={difficulty}
                  isSelected={currentDifficulty === difficulty}
                  onClick={handleTagClick}
                  size="sm"
                  isFullWidth={true}
                >
                  {difficulty}
                </Tag>
              );
            })}
          </div>
        </div>
      </div>

      {isExpanded && currentDifficulty === '커스텀' && <SubCategorySection subCategories={category.subCategories} />}
    </div>
  );
}

'use client';

import React from 'react';
import Tag from '@/components/common/Tag';
import { difficultyMapping, subCategoryMapping } from '@/utils/mapDifficulty';
import { useDifficultySettings } from '@/hooks/useDifficultySettings';

interface SubCategory {
  subCategoryId: number;
  subCategoryName: string;
  difficulty: string;
}

interface SubCategorySectionProps {
  subCategories: SubCategory[];
}

const SUB_DIFFICULTY_OPTIONS = ['쉬움', '중간', '어려움'] as const;

interface Props {
  subCategory: SubCategory;
}

function SubCategoryItem({ subCategory }: Props) {
  const { handleSubCategoryDifficultyChange } = useDifficultySettings();
  const koreanSubCategoryName = subCategoryMapping[subCategory.subCategoryName] || subCategory.subCategoryName;
  const koreanDifficulty = difficultyMapping[subCategory.difficulty] || '중간';

  return (
    <div className="mb-3">
      <div className="mb-1 text-lg text-gray-600">{koreanSubCategoryName}</div>
      <div className="flex space-x-2">
        {SUB_DIFFICULTY_OPTIONS.map((difficulty) => {
          const handleTagClick = () => {
            handleSubCategoryDifficultyChange(subCategory.subCategoryName, difficulty);
          };

          return (
            <Tag
              key={`${subCategory.subCategoryId}-${difficulty}`}
              isSelected={koreanDifficulty === difficulty}
              onClick={handleTagClick}
              size="sm"
              isFullWidth
            >
              {difficulty}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}

export default function SubCategorySection({ subCategories }: SubCategorySectionProps) {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="border-l-2 border-gray-200 pl-4">
        {subCategories.map((subCategory) => (
          <SubCategoryItem key={subCategory.subCategoryId} subCategory={subCategory} />
        ))}
      </div>
    </div>
  );
}

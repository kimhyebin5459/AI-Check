'use client';

import React from 'react';
import Tag from '@/components/common/Tag';
import { useDifficultyStore } from '@/stores/useDifficultyStore';
import { DisplayDifficulty, toDisplayDifficulty } from '@/types/difficulty';

interface SubCategory {
  subCategoryId: number;
  subCategoryName: string;
  difficulty: string;
}

interface Props {
  parentCategory: string;
  subCategories: SubCategory[];
}

const SUB_DIFFICULTY_OPTIONS: DisplayDifficulty[] = ['쉬움', '중간', '어려움'];

interface SubCategoryItemProps {
  parentCategory: string;
  subCategory: SubCategory;
}

function SubCategoryItem({ parentCategory, subCategory }: SubCategoryItemProps) {
  const { handleSubCategoryDifficultyChange } = useDifficultyStore();

  const displaySubCategoryName = subCategory.subCategoryName;
  const displayDifficulty = toDisplayDifficulty(subCategory.difficulty);

  return (
    <div className="mb-3">
      <div className="mb-1 text-lg text-gray-600">{displaySubCategoryName}</div>
      <div className="flex space-x-2">
        {SUB_DIFFICULTY_OPTIONS.map((difficulty) => {
          const handleTagClick = () => {
            handleSubCategoryDifficultyChange(parentCategory, subCategory.subCategoryId, difficulty);
          };

          return (
            <Tag
              key={`${subCategory.subCategoryId}-${difficulty}`}
              isSelected={displayDifficulty === difficulty}
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

export default function SubCategorySection({ parentCategory, subCategories }: Props) {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="border-l-2 border-gray-200 pl-4">
        {subCategories.map((subCategory) => (
          <SubCategoryItem key={subCategory.subCategoryId} parentCategory={parentCategory} subCategory={subCategory} />
        ))}
      </div>
    </div>
  );
}

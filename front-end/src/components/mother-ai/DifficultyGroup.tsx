'use client';

import React, { useState } from 'react';
import Tag from '@/components/common/Tag';

interface Props {
  title: string;
  options: string[];
}

export default function DifficultyGroup({ title, options }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>('중간');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // 커스텀이 선택되었을 때 보여줄 추가 옵션들
  const customOptions = ['버스', '택시']; // 예시 옵션

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex cursor-pointer items-center justify-between" onClick={toggleExpand}>
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="transform transition-transform">
          {isExpanded ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <div className="mb-3 flex space-x-2">
            {options.map((option) => (
              <Tag key={option} isSelected={selectedOption === option} onClick={() => setSelectedOption(option)}>
                {option}
              </Tag>
            ))}
          </div>

          {selectedOption === '커스텀' && (
            <div className="mt-2 border-l-2 border-gray-200 pl-4">
              {customOptions.map((option, index) => (
                <div key={index} className="mb-2">
                  <div className="text-sm text-gray-500">{option}</div>
                  <div className="mt-1 flex space-x-2">
                    <Tag isSelected={true} onClick={() => {}} size="xs">
                      쉬움
                    </Tag>
                    <Tag isSelected={false} onClick={() => {}} size="xs">
                      중간
                    </Tag>
                    <Tag isSelected={false} onClick={() => {}} size="xs">
                      어려움
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

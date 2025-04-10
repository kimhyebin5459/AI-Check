'use client';

import React from 'react';
import { useDifficultyStore } from '@/stores/useDifficultyStore';

export default function ContentTextArea() {
  const { content, setContent } = useDifficultyStore();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">추가 지시사항 (선택)</h3>
        <span className="text-sm text-gray-500">{content?.length || 0}/500자</span>
      </div>
      <textarea
        className="w-full rounded-lg border border-gray-200 p-4 text-base"
        placeholder="아이가 설득할 때 추가로 보여주고 싶은 내용이나 지시사항을 입력해주세요. (500자 이내)"
        rows={5}
        maxLength={500}
        value={content || ''}
        onChange={handleChange}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProfileImage from '@/components/common/ProfileImage';
import Spinner from '@/components/common/Spinner';
import useGetChildProfileList from '@/hooks/query/useGetChildProfileList';

export default function ChildList() {
  const router = useRouter();
  const { data: children = [], isLoading, error } = useGetChildProfileList();

  const handleChildSelect = (childId: number) => {
    router.push(`/mother-ai/customize/${childId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-500">
        {error instanceof Error ? error.message : '자녀 목록을 불러오는데 실패했습니다.'}
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center text-gray-500">
        등록된 자녀가 없습니다.
      </div>
    );
  }

  return (
    <div className="h-[72%] rounded-tl-4xl rounded-tr-4xl bg-white px-7 pt-9">
      {children.map((child) => (
        <div
          key={child.childId}
          className="flex cursor-pointer items-center justify-between border-b border-gray-100 py-4 last:border-b-0"
          onClick={() => handleChildSelect(child.childId)}
        >
          <div className="flex items-center gap-3">
            <ProfileImage image={child.image} size="sm" />
            <span className="text-xl font-bold">{child.name}</span>
          </div>
          <div>
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

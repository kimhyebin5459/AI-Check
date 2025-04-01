'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileImage from '@/components/common/ProfileImage';
import Spinner from '@/components/common/Spinner';

interface ChildProfile {
  childId: number;
  name: string;
  image: string;
}

export default function ChildList() {
  const router = useRouter();

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/aicheck/members/children/profiles');

        if (!response.ok) {
          throw new Error('자녀 목록을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setChildren(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const handleChildSelect = (childId: number) => {
    router.push(`/mother-ai/customize/${childId}`);
  };

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

  if (children.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center text-gray-500">
        등록된 자녀가 없습니다.
      </div>
    );
  }

  return (
    <div className="h-[72%] rounded-xl bg-white p-4">
      {children.map((child) => (
        <div
          key={child.childId}
          className="flex cursor-pointer items-center justify-between border-b border-gray-100 py-4 last:border-b-0"
          onClick={() => handleChildSelect(child.childId)}
        >
          <div className="flex items-center gap-3">
            <ProfileImage image={child.image} size="sm" />
            <span className="text-lg">{child.name}</span>
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

'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import ProfileImage from '@/components/common/ProfileImage';

interface Child {
  id: string;
  name: string;
  image: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (childId: string) => void;
}

export default function ChildSelectModal({ isOpen, onClose, onSelect }: Props) {
  // 실제 구현에서는 API 호출이나 상태 관리를 통해 자녀 목록을 가져올 것입니다
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const handleSelect = (childId: string) => {
    if (onSelect) {
      onSelect(childId);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="center" title="설정 불러오기">
      <div className="w-full">
        {children.map((child) => (
          <div
            key={child.id}
            className="flex cursor-pointer items-center justify-between py-3"
            onClick={() => handleSelect(child.id)}
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
    </Modal>
  );
}

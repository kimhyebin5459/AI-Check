'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import ProfileImage from '@/components/common/ProfileImage';
import Spinner from '@/components/common/Spinner';

interface Child {
  childId: string;
  name: string;
  image: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (childId: string) => void;
  currentChildId?: string;
}

export default function ChildSelectModal({ isOpen, onClose, onSelect, currentChildId }: Props) {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 모달이 열릴 때만 데이터를 가져오도록 수정
    if (isOpen) {
      fetchChildren();
    }
  }, [isOpen]);

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

  const handleSelect = (childId: string) => {
    if (onSelect) {
      onSelect(childId);
    }
    onClose();
  };

  // 현재 자녀를 제외한 자녀 목록 필터링
  const filteredChildren = children.filter((child) => String(child.childId) !== String(currentChildId));

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="center" title="설정 불러오기">
      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-center text-red-500">{error}</div>
        ) : filteredChildren.length === 0 ? (
          <div className="py-4 text-center text-gray-500">불러올 수 있는 다른 자녀가 없습니다.</div>
        ) : (
          filteredChildren.map((child) => (
            <div
              key={child.childId}
              className="flex cursor-pointer items-center justify-between py-3"
              onClick={() => handleSelect(child.childId)}
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
          ))
        )}
      </div>
    </Modal>
  );
}

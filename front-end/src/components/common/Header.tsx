'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  title?: string;
  hasBorder?: boolean;
  hasBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

export default function Header({ title, hasBorder = true, hasBackButton = false, onBackClick, className = '' }: Props) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={`fixed-container relative top-0 flex h-16 items-center justify-center ${hasBorder ? 'border-b border-gray-200' : ''} ${className} `}
    >
      {hasBackButton && (
        <button
          onClick={handleBackClick}
          className="absolute left-2.5 flex h-10 w-10 items-center justify-center text-gray-800"
          aria-label="뒤로 가기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-800"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {title && <h1 className="text-lg font-semibold text-gray-800">{title}</h1>}
    </header>
  );
}

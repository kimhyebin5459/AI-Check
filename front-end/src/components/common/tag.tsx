'use client';

import { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  isSelected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export default function Tag({ children, isSelected, onClick, size = 'sm' }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={`border ${size === 'sm' ? 'rounded-xl px-4 py-1' : 'h-12 w-full rounded-2xl text-gray-800'} ${
        isSelected ? 'border-yellow-300 bg-yellow-300 font-semibold text-white' : 'border-gray-200 bg-white'
      }`}
    >
      {children}
    </button>
  );
}

'use client';

import { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export default function Tag({ children, isSelected, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-4 py-1 ${
        isSelected ? 'text-semibold border-yellow-300 bg-yellow-300 text-white' : 'border-gray-200 bg-white'
      }`}
    >
      {children}
    </button>
  );
}

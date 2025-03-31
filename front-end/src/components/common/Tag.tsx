'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  isSelected: boolean;
  onClick: () => void;
  size?: 'xs' | 'sm' | 'md';
}

export default function Tag({ children, isSelected, onClick, size = 'sm' }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `border ${
          isSelected ? 'border-yellow-300 bg-yellow-300 font-semibold text-white' : 'border-gray-200 bg-white'
        } `,
        {
          'rounded-xl px-4 py-1': size === 'sm',
          'h-12 w-full rounded-2xl text-gray-800': size === 'md',
          'h-9 w-full rounded-xl text-sm text-gray-800': size === 'xs',
        }
      )}
    >
      {children}
    </button>
  );
}

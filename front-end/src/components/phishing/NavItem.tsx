import React from 'react';

interface Props {
  label: string;
  targetId: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export default function NavItem({ label, icon, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-2 py-1 ${
        isActive ? 'font-medium text-yellow-600' : 'text-gray-600'
      }`}
    >
      <div className={`${isActive ? 'bg-yellow-200' : 'bg-gray-100'} mb-1 rounded-full p-2`}>{icon}</div>
      <span className="text-xs">{label}</span>
    </button>
  );
}

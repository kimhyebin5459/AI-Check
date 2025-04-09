import React from 'react';

interface Props {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function Section({ id, title, icon, children }: Props) {
  return (
    <div id={id} className="mb-6 w-full scroll-mt-20 rounded-lg bg-white px-4 py-5 shadow-sm">
      <div className="mb-4 flex items-center">
        <div className="mr-3 rounded-full bg-yellow-200 p-2">{icon}</div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

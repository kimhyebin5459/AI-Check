import React from 'react';

interface Props {
  title: string;
  details: string[];
}

export default function GuideItem({ title, details }: Props) {
  return (
    <div className="mb-5 border-b border-gray-100 pb-4 last:mb-0 last:border-b-0 last:pb-0">
      <h3 className="mb-2 text-base font-semibold text-gray-700">{title}</h3>
      <ul className="space-y-2 pl-5">
        {details.map((detail, index) => (
          <li key={index} className="flex items-start text-sm text-gray-600">
            <span className="mt-1.5 mr-2 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400"></span>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

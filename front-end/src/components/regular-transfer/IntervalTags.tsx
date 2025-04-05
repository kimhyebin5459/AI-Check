'use client';

import Tag from '@/components/common/Tag';
import { intervalCategory } from '@/utils/formatInterval';

interface Props {
  selectedInterval: string;
  onSelect: (interval: string) => void;
}

export default function IntervalTags({ selectedInterval, onSelect }: Props) {
  return (
    <div className="flex w-full space-x-3">
      {Object.keys(intervalCategory).map((tag) => (
        <Tag key={tag} size="md" isSelected={selectedInterval === tag} onClick={() => onSelect(tag)}>
          {intervalCategory[tag]}
        </Tag>
      ))}
    </div>
  );
}

'use client';

import Tag from '@/components/common/Tag';
import { IntervalType } from '@/types/regularTransfer';
import { intervalCategory } from '@/utils/formatInterval';

interface Props {
  selectedInterval?: IntervalType;
  onSelect: (interval: IntervalType) => void;
}

export default function IntervalTags({ selectedInterval, onSelect }: Props) {
  return (
    <div className="flex w-full space-x-3">
      {(Object.entries(intervalCategory) as [IntervalType, string][]).map(([key, label]) => (
        <Tag key={key} size="md" isSelected={selectedInterval === key} onClick={() => onSelect(key)}>
          {label}
        </Tag>
      ))}
    </div>
  );
}

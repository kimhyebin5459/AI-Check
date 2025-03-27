'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Props {
  lines: string[];
  image: string;
  caseCnt?: number;
  color: string;
  to: string;
}

export default function NavButton({ lines, image, caseCnt, color, to }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(to);
  };

  return (
    <div
      className={clsx(`shadow-base flex h-full w-full flex-col rounded-2xl text-2xl font-bold`, {
        'bg-yellow-100': color === 'yellow-100',
        'bg-yellow-200': color === 'yellow-200',
        'bg-gradation1': color === 'gradation1',
      })}
      onClick={handleClick}
    >
      <div className="pt-4 pl-4">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className="flex h-full w-full justify-between pr-2">
        <div className="relative h-full w-full">
          <Image src={image} alt="nav image" fill className="object-contain pb-1 pl-3" />
        </div>
        {caseCnt !== undefined && (
          <div className="flex flex-col justify-end">
            <p className="pr-3 pb-5 text-4xl font-black tracking-wide whitespace-nowrap">{caseCnt}건</p>
          </div>
        )}
      </div>
    </div>
  );
}

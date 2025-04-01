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

  // 단어에 하이라이트 추가 함수
  const renderLineWithHighlight = (line: string) => {
    // '위험' 단어만 하이라이트
    if (line.includes('위험')) {
      const parts = line.split('위험');
      return (
        <>
          {parts[0]}
          <span className="text-red-500">위험</span>
          {parts[1]}
        </>
      );
    }
    return line;
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
      <div className="pt-4 pl-4 leading-7">
        {lines.map((line) => (
          <p key={line}>{renderLineWithHighlight(line)}</p>
        ))}
      </div>
      <div className="flex h-full w-full justify-between pr-2">
        <div className="relative flex h-full w-full items-end">
          <Image src={image} alt="nav image" fill className="object-contain object-bottom pb-1 pl-3" />
        </div>
        {caseCnt !== undefined && (
          <div className="flex flex-col justify-end">
            <p className="pr-2 pb-3 text-3xl font-black tracking-wide whitespace-nowrap">{caseCnt}건</p>
          </div>
        )}
      </div>
    </div>
  );
}

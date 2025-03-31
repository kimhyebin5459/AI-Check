import React from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';

import { YellowCheck, ErrorTriangle } from '@/public/icons';

type IconType = 'success' | 'error';

interface Props {
  title: string;
  message?: string;
  iconType?: IconType;
  buttonText: string;
  onButtonClick: () => void;
}

export default function NoticePage({ title, message, iconType = 'success', buttonText, onButtonClick }: Props) {
  const renderIcon = () => {
    switch (iconType) {
      case 'success':
        return (
          <div className="relative h-16 w-16">
            <Image src={YellowCheck} alt="성공" width={64} height={64} priority />
          </div>
        );

      case 'error':
        return (
          <div className="relative h-16 w-16">
            <Image src={ErrorTriangle} alt="에러" width={64} height={64} priority />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-grow flex-col items-center justify-center pb-10">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="mb-8">{renderIcon()}</div>

          <h1 className="mb-3 text-center text-xl font-bold">{title}</h1>

          {message && <p className="mb-10 text-center text-gray-600">{message}</p>}
        </div>
      </main>
      <div className="bottom-btn w-full">
        <Button type="button" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

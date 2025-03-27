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

export default function NoticePage({
  title,
  message,
  iconType = 'success',
  buttonText,
  onButtonClick,
}: Props) {
  const renderIcon = () => {
    switch (iconType) {
      case 'success':
        return (
          <div className="h-16 w-16 relative">
            <Image
              src={YellowCheck}
              alt="성공"
              width={64}
              height={64}
              priority
            />
          </div>
        );

      case 'error':
        return (
          <div className="h-16 w-16 relative">
            <Image
              src={ErrorTriangle}
              alt="에러"
              width={64}
              height={64}
              priority
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex flex-col items-center justify-center flex-grow px-6">
        <div className="flex flex-col items-center max-w-md w-full">
          <div className="mb-8">
            {renderIcon()}
          </div>

          <h1 className="text-xl font-bold text-center mb-3">
            {title}
          </h1>

          {message && (
            <p className="text-gray-600 text-center mb-10">
              {message}
            </p>
          )}

          <div className="w-full mt-auto">
            <Button
              type="button"
              variant="primary"
              isFullWidth
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
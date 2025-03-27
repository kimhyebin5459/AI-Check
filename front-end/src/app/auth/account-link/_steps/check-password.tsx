"use client";

import Header from '@/components/common/Header';
import { useState, useEffect } from 'react';

type AccountType = {
  id: string;
  accountNumber: string;
  bankName: string;
};

type Props = {
  account?: AccountType;
  onNext: () => void;
  onPrev: () => void;
};

export default function CheckPassword({ account, onNext, onPrev }: Props) {
  const [password, setPassword] = useState('');

  // 네이티브 뒤로가기 처리
  useEffect(() => {
    window.history.pushState({ page: 'check-password' }, '');

    const handlePopState = (event: Event) => {
      event.preventDefault();

      onPrev();

      window.history.pushState({ page: 'check-password' }, '');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onPrev]);

  const handlePasswordChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setPassword(value);
    }
  };

  const handleNumberClick = (num: number) => {
    if (password.length < 6) {
      handlePasswordChange(password + num);
    }

    if (password.length === 5) {
      setTimeout(() => {
        handleSubmit();
      }, 300);
    }
  };

  const handleBackspace = () => {
    if (password.length > 0) {
      setPassword(password.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    alert("account: " + account?.accountNumber + " password: " + password + "로 계좌번호 검증을 시도합니다.")
    onNext();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header hasBackButton hasBorder={false}></Header>

      <div className="flex flex-col items-center justify-center flex-grow mb-12">
        <h1 className="text-mdl font-bold mb-12">계좌 비밀번호를 입력해주세요</h1>

        <div className="flex space-x-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i < password.length ? 'bg-yellow-300' : 'bg-gray-300'
                }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-auto mb-10 mx-auto w-full max-w-xs">
        <div className="grid grid-cols-3 gap-x-12 gap-y-6 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div key={num} className="flex items-center justify-center">
              <button
                onClick={() => handleNumberClick(num)}
                className="text-4xl font-medium h-12 w-12 text-center grid place-items-center"
              >
                {num}
              </button>
            </div>
          ))}
          <div className="flex items-center justify-center col-start-1 col-end-2"></div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleNumberClick(0)}
              className="text-4xl font-medium h-12 w-12 text-center grid place-items-center"
            >
              0
            </button>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={handleBackspace}
              className="text-3xl text-gray-400 h-12 w-12 text-center grid place-items-center"
            >
              ←
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
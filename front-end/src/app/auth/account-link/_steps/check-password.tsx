'use client';

import Header from '@/components/common/Header';
import { useState, useEffect } from 'react';

import { Account } from '@/types/account';
import NumberKeypad from '@/components/common/NumberKeypad';

type Props = {
  account?: Account;
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

  useEffect(() => {
    if (password.length === 6) {
      setTimeout(() => {
        handleSubmit();
      }, 300);
    }
  }, [password]);

  const handlePasswordChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setPassword(value);
    }
  };

  const handleNumberClick = (num: number) => {
    handlePasswordChange(password + num);
  };

  const handleBackspace = () => {
    if (password.length > 0) {
      setPassword(password.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    alert('account: ' + account?.accountNo + ' password: ' + password + '로 계좌번호 검증을 시도합니다.');
    onNext();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header hasBackButton hasBorder={false}></Header>

      <div className="mb-12 flex flex-grow flex-col items-center justify-center">
        <h1 className="text-mdl mb-12 font-bold">계좌 비밀번호를 입력해주세요</h1>

        <div className="flex space-x-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-3 w-3 rounded-full ${i < password.length ? 'bg-yellow-300' : 'bg-gray-300'}`} />
          ))}
        </div>
      </div>

      <NumberKeypad
        onNumberClick={handleNumberClick}
        rightAction="arrow"
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

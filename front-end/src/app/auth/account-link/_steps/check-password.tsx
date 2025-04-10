'use client';

import Header from '@/components/common/Header';
import { useState, useEffect } from 'react';
import { Account } from '@/types/account';
import NumberKeypad from '@/components/common/NumberKeypad';
import { postAccount, postPasswordConfirm } from '@/apis/account';

type Props = {
  account?: Account;
  onNext: () => void;
  onPrev: () => void;
};

export default function CheckPassword({ account, onNext, onPrev }: Props) {
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const verifyPassword = async () => {
      if (password.length === 4 && account?.accountId) {
        try {
          setIsVerifying(true);
          setError(null);

          await postPasswordConfirm({
            accountId: account.accountId,
            password,
          });

          await postAccount(account.accountId);
          onNext();
        } catch (_err) {
          setError('계좌 비밀번호가 올바르지 않습니다');
          setPassword('');
        } finally {
          setIsVerifying(false);
        }
      }
    };

    verifyPassword();
  }, [account, password, onNext]);

  const handlePasswordChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPassword(value);
      setError(null);
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header hasBackButton hasBorder={false} onBackClick={onPrev}></Header>

      <div className="mb-12 flex flex-grow flex-col items-center justify-center">
        <h1 className="text-mdl mb-8 font-bold">계좌 비밀번호를 입력해주세요</h1>

        <div className="mb-4 flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full ${
                i < password.length ? 'bg-yellow-300' : 'bg-gray-300'
              } ${isVerifying ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>

        {error && <div className="mt-4 text-sm text-red-500">{error}</div>}
      </div>

      <NumberKeypad onNumberClick={handleNumberClick} rightAction="arrow" onBackspace={handleBackspace} />
    </div>
  );
}

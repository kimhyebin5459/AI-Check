'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import ChildAccountCard from '@/components/transfer/ChildAccountCard';
import Link from 'next/link';
import Spinner from '@/components/common/Spinner';

// 자녀 계정 타입 정의
interface ChildAccount {
  childId: number;
  image: string | null;
  name: string;
  balance: number | null;
  accountNo: string | null;
  accountName: string | null;
}

export default function Page() {
  const [accounts, setAccounts] = useState<ChildAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/aicheck/accounts/children');
        console.log('res:', response);

        if (!response.ok) {
          throw new Error('계정 정보를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        console.log('data:', data);

        setAccounts(data.accounts);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError(err instanceof Error ? err.message : '계정 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="container justify-center">
        <Header hasBackButton hasBorder={false} />
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container justify-center">
        <Header hasBackButton hasBorder={false} />
        <div className="flex h-screen w-full flex-col items-center justify-center px-5">
          <p className="mb-4 text-center text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container justify-center">
      <Header hasBackButton hasBorder={false} />
      <div className="w-full space-y-10 overflow-y-auto px-5 pb-[5.5rem]">
        <div className="text-mdl flex w-full flex-col justify-start font-bold">
          <p>자녀들을</p>
          <p>한 눈에 관리해요</p>
        </div>
        <div className="w-full space-y-4">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <ChildAccountCard
                key={account.accountNo || `member-${account.childId}`}
                childId={account.childId}
                image={account.image || ''}
                name={account.name}
                accountName={account.accountName || ''}
                accountNo={account.accountNo || ''}
                balance={account.balance || 0}
              />
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">등록된 자녀 계좌가 없습니다.</p>
          )}
        </div>
        <div className="flex w-full gap-2">
          <Link href="/mother-ai/list" className="w-full">
            <Button size="lg">엄마 AI 설정</Button>
          </Link>
          <Link href="/regular-transfer" className="w-full">
            <Button size="lg">정기 송금 관리</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import ChildAccountCard from '@/components/transfer/ChildAccountCard';
import Link from 'next/link';
import useGetChildAccountList from '@/hooks/query/useGetChildAccountList';
import ErrorComponent from '@/app/_components/error-component';
import LoadingComponent from '@/app/_components/loading-component';

export default function Page() {
  const { data: accounList, isPending, isError } = useGetChildAccountList();

  if (isPending) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return (
    <div className="container justify-center">
      <Header hasBackButton hasBorder={false} backPath="/" />
      <div className="w-full space-y-10 overflow-y-auto px-5 pb-[5.5rem]">
        <div className="text-mdl flex w-full flex-col justify-start pt-16 font-bold">
          <p>자녀들을</p>
          <p>한 눈에 관리해요</p>
        </div>
        <div className="w-full">
          {accounList.length > 0 ? (
            accounList?.map((account) => <ChildAccountCard key={account.accountNo} account={account} />)
          ) : (
            <p className="py-4 text-center text-gray-500">등록된 자녀 계좌가 없습니다.</p>
          )}
        </div>
        <div className="flex w-full gap-4">
          <Link href="mother-ai/list" className="w-full">
            <Button variant="secondary" size="lg">
              엄마 AI 설정
            </Button>
          </Link>
          <Link href="/regular-transfer" className="w-full">
            <Button size="lg">정기 송금 관리</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

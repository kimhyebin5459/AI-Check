'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Footer from '@/components/common/footer/Footer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChartButton } from '@/public/icons';
import ProfileImage from '@/components/common/ProfileImage';
import TransactionHistory from '@/components/money-check/TransactionHistory';
import DateFilterModal from '@/components/money-check/DateFilterModal';
import useModal from '@/hooks/useModal';
import { getFilterText } from '@/utils/formatTransaction';
import Spinner from '@/components/common/Spinner';
import { TransactionFilterType } from '@/types/transaction';
import { getChildAccount } from '@/apis/account';
import { Account } from '@/types/account';
import { ChildProfile } from '@/types/user';
import useGetChildProfileList from '@/hooks/query/useGetChildProfileList';

interface Props {
  params: Promise<{ childId: string }>;
}

export default function MoneyCheckClient({ params }: Props) {
  const [childId, setChildId] = useState<string>('');

  useEffect(() => {
    const fetchChildId = async () => {
      const resolvedParams = await params;
      setChildId(resolvedParams.childId);
    };

    fetchChildId();
  }, [params]);

  const [account, setAccount] = useState<Account | null>(null);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 아이 프로필 목록 쿼리 추가
  const { data: childProfileList, isLoading: isProfileLoading } = useGetChildProfileList();

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [transactionType, setTransactionType] = useState<TransactionFilterType>('ALL');
  const [dateRangeType, setDateRangeType] = useState<string>('MONTH');

  const { isModalOpen, openModal, closeModal } = useModal();
  const router = useRouter();

  // 아이 프로필 찾기
  useEffect(() => {
    if (childProfileList && childId) {
      const foundChild = childProfileList.find((child) => child.childId === Number(childId));
      if (foundChild) {
        setChildProfile(foundChild);
      }
    }
  }, [childProfileList, childId]);

  useEffect(() => {
    const fetchChildData = async () => {
      if (!childId) return;

      setLoading(true);
      try {
        const response = await getChildAccount(Number(childId));

        setAccount({
          accountId: response.accountId,
          accountName: response.accountName || '입출금 계좌',
          accountNo: response.accountNo || '',
          balance: response.balance || 0,
        });
      } catch (err) {
        console.error('Error fetching child data:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, [childId]);

  const handleProfileClick = () => {
    router.push(`/profile/${childId}`);
  };

  const handleChartClick = () => {
    router.push(`/report/${childId}`);
  };

  const handleFilterApply = (
    newStartDate: Date,
    newEndDate: Date,
    newType: TransactionFilterType,
    newDateRangeType: string
  ) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setTransactionType(newType);
    setDateRangeType(newDateRangeType);
  };

  // 로딩 상태 병합 (계좌 로딩 + 프로필 로딩)
  if (loading || isProfileLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-5">
        <p className="mb-4 text-center text-red-500">{error || '데이터를 불러오는데 실패했습니다.'}</p>
        <Button onClick={() => window.location.reload()}>다시 시도</Button>
      </div>
    );
  }

  // 프로필 정보가 없을 경우 처리
  if (!childProfile) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-5">
        <p className="mb-4 text-center text-red-500">아이 프로필 정보를 찾을 수 없습니다.</p>
        <Button onClick={() => window.location.reload()}>다시 시도</Button>
      </div>
    );
  }

  return (
    <>
      <div className="h-full pb-[5.5rem]">
        <div className="container">
          <Header title="용돈 기록장" hasBackButton />
          <main className="scrollbar-hide w-full overflow-y-auto p-5">
            <div>
              <div className="flex w-full items-center justify-between">
                <div className="flex cursor-pointer items-center text-2xl">
                  <div className="underline decoration-1 underline-offset-4" onClick={handleProfileClick}>
                    <span className="font-bold">{childProfile.name}</span>
                    &nbsp;
                    <span className="font-light">님</span>
                  </div>
                  <span className="ml-1">&gt;</span>
                </div>
                <div className="flex space-x-2">
                  <Image src={ChartButton} alt="분석보기" onClick={handleChartClick} className="cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="my-4 rounded-xl bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]">
              <div className="rounded-t-lg bg-yellow-200 p-2.5">
                <div className="flex items-center">
                  <ProfileImage image={childProfile.image} size="md" />
                  <div className="ml-5 font-light">
                    <p className="text-xl">{account.accountName}</p>
                    <p className="text-base">{account.accountNo}</p>
                  </div>
                </div>
              </div>
              <div className="py-4">
                <div className="text-center text-4xl font-bold">
                  {account?.balance !== undefined ? account.balance.toLocaleString() : 0}원
                </div>
              </div>
            </div>

            <TransactionHistory
              childId={childId}
              startDate={startDate}
              endDate={endDate}
              type={transactionType}
              showFilterHeader={true}
              onFilterClick={openModal}
              customFilterText={getFilterText(dateRangeType, transactionType)}
            />
          </main>
          <Footer />
        </div>
      </div>

      <DateFilterModal
        isModalOpen={isModalOpen}
        onClose={closeModal}
        onApply={handleFilterApply}
        initialStartDate={startDate}
        initialEndDate={endDate}
        initialType={transactionType}
        initialDateRangeType={dateRangeType}
      />
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import RequestCard from '@/components/request/RequestCard';
import Spinner from '@/components/common/Spinner';
import { getRequestList } from '@/apis/request';
import useGetUserInfo from '@/hooks/query/useGetUserInfo';

export default function Page() {
  const [isParent, setIsParent] = useState<boolean>(false);

  const { data: userData, isLoading: userLoading, error: userError } = useGetUserInfo();

  const {
    data: requestList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['requestList'],
    queryFn: getRequestList,
    enabled: !userLoading,
  });

  useEffect(() => {
    if (userData) {
      setIsParent(userData.type === 'PARENT');
    }
  }, [userData]);

  if (isLoading || userLoading) {
    return (
      <div className="container bg-gray-50">
        <Header hasBackButton hasBorder={false} title="용돈 요청 내역" />
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
          <Spinner size="md" />
        </div>
      </div>
    );
  }

  if (error || userError) {
    return (
      <div className="container bg-gray-50">
        <Header hasBackButton hasBorder={false} title="용돈 요청 내역" />
        <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center p-5 text-center">
          <p className="text-red-500">요청 내역을 불러오는데 실패했습니다.</p>
          <p className="mt-2 text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  if (!requestList || requestList.length === 0) {
    return (
      <div className="container bg-gray-50">
        <Header hasBackButton hasBorder={false} title="용돈 요청 내역" />
        <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center p-5 text-center">
          <p className="text-gray-500">요청 내역이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container bg-gray-50">
      <Header hasBackButton hasBorder={false} title="용돈 요청 내역" />
      <div className="w-full space-y-2 overflow-y-auto p-5">
        {requestList.map((req) => (
          <RequestCard key={req.id + req.type} request={req} isParent={isParent} />
        ))}
      </div>
    </div>
  );
}

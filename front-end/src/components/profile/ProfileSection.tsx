'use client';

import ErrorComponent from '@/app/_components/error-component';
import LoadingComponent from '@/app/_components/loading-component';
import ProfileImage from '@/components/common/ProfileImage';
import NoticePage from '@/components/common/NoticePage';
import useGetUserInfo from '@/hooks/query/useGetUserInfo';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Settings } from 'lucide-react';
import Header from '../common/Header';

export default function Page() {
  const { data: user, isPending, isError } = useGetUserInfo();
  const { logout, isLoggedOut, completeLogout } = useAuth();

  if (isPending) return <LoadingComponent />;

  if (isLoggedOut) {
    return (
      <NoticePage
        title="로그아웃 되었습니다"
        message="다시 로그인하려면 아래 버튼을 클릭해주세요."
        iconType="success"
        buttonText="로그인 페이지로 이동"
        onButtonClick={completeLogout}
      />
    );
  }

  if (isError) return <ErrorComponent />;

  return (
    <>
      <div className="h-full w-full pb-[5.5rem]">
        <div className="container">
          <Header hasBackButton title="내 정보" hasBorder={false} backPath="/" />
          <div className="scrollbar-hide w-full overflow-y-auto p-5">
            <div className="flex flex-col items-center justify-center space-y-3 pt-10">
              <ProfileImage image={user?.image} size="xl" />
              <p className="text-2xl font-bold text-gray-800">{user?.name}</p>
            </div>
            <div className="shadow-base mt-6 w-full space-y-7 rounded-xl bg-white px-6 py-7">
              <div className="flex w-full items-center">
                <p className="min-w-24 text-xl font-semibold text-gray-600">이름</p>
                <div className="flex w-full justify-between">
                  <p className="font-light">{user?.name}</p>
                </div>
              </div>
              <div className="flex w-full items-center">
                <p className="min-w-24 text-xl font-semibold text-gray-600">생년월일</p>
                <p className="font-light">{user?.birth.replaceAll('-', '.')}</p>
              </div>
              <div className="flex w-full items-start">
                <p className="min-w-24 text-xl font-semibold text-gray-600">연동 계좌</p>
                <div>
                  <p className="font-light">{user?.account.no}</p>
                  <p className="-mt-1.5 text-sm font-light text-gray-400">{user?.account.name}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex w-full items-center justify-between text-sm">
              <div
                className="shadow-base cursor-pointer justify-start rounded-2xl bg-gray-100 p-3 px-3 py-2 text-gray-700 select-none"
                onClick={logout}
              >
                로그아웃
              </div>
              <div className="shadow-base rounded-2xl bg-amber-200 px-3 py-2 select-none">
                <Link href={'/profile/edit'} className="flex items-center font-light whitespace-nowrap text-gray-900">
                  회원 정보 수정
                  <Settings color="gray" size={20} className="pl-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import ErrorComponent from '@/app/_components/error-component';
import LoadingComponent from '@/app/_components/loading-component';
import ProfileImage from '@/components/common/ProfileImage';
import NoticePage from '@/components/common/NoticePage';
import useGetUserInfo from '@/hooks/query/useGetUserInfo';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Page() {
  const { data: user, isPending, isError } = useGetUserInfo();
  const { logout, isLoggedOut, completeLogout } = useAuth();

  if (isPending) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

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

  return (
    <>
      <div className="space-y-3 pt-10 text-center">
        <ProfileImage image={user?.image} size="xl" />
        <p className="text-2xl font-bold text-gray-800">{user?.name}</p>
      </div>
      <div className="w-full space-y-7 rounded-xl bg-white px-6 py-7">
        <div className="flex w-full items-center">
          <p className="min-w-24 text-xl font-semibold text-gray-600">이름</p>
          <div className="flex w-full justify-between">
            <p className="font-light">{user?.name}</p>
            <Link href={'/profile/edit'} className="-m-2 p-2 font-light text-gray-400">
              변경
            </Link>
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
      <div className="w-full justify-start p-3 text-base text-gray-700" onClick={logout}>
        로그아웃
      </div>
    </>
  );
}

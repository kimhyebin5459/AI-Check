'use client';

import { Arrow, Sprout } from '@/public/icons';
import ProfileImage from '@/components/common/ProfileImage';
import ParentAccountCard from '@/components/main/ParentAccountCard';
import NavButton from '@/components/main/NavButton';
import Image from 'next/image';
import Link from 'next/link';
import { CHILD_ITEM, COMMON_ITEM, PARENT_ITEM } from '@/constants/main';
import { UserType } from '@/types/user';
import useGetUserInfo from '@/hooks/query/useGetUserInfo';
import { getPhishing } from '@/apis/phishing';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AccountCard from '@/components/main/AccountCard';
import Spinner from '@/components/common/Spinner';

const UserListSection = dynamic(() => import('@/components/main/UserListSection'), {
  ssr: false,
});

export default function Home() {
  const { data: user } = useGetUserInfo();
  const role: UserType = user?.type || 'PARENT';
  const [phishingCount, setPhishingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPhishingData = async () => {
      try {
        const statsData = await getPhishing();
        setPhishingCount(statsData?.familyCount || 0);
      } catch (err) {
        console.error('피싱 데이터를 가져오는데 실패했습니다:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhishingData();
  }, []);

  const homeItems = [role === 'PARENT' ? PARENT_ITEM : CHILD_ITEM, ...COMMON_ITEM];
  if (loading) {
    <div className="flex flex-grow flex-col items-center justify-center">
      <Spinner />
    </div>;
  }

  return (
    <div className="container space-y-5 px-5 pb-7">
      <div className="flex w-full items-center justify-start space-x-2">
        {role === 'PARENT' ? (
          <ProfileImage image={user?.image} size="sm" />
        ) : (
          <Image src={Sprout} alt="sprout icon" className="size-7"></Image>
        )}
        <Link href={'/profile'}>
          <div className="flex items-center space-x-1">
            <p className="text-2xl font-bold">{user?.name} </p>
            <p className="text-2xl font-medium">님</p>
            <div className="size-7 rotate-180">
              <Image src={Arrow} alt="arrow icon"></Image>
            </div>
          </div>
        </Link>
      </div>
      {role === 'PARENT' && (
        <>
          <UserListSection />
          <ParentAccountCard />
        </>
      )}
      {role === 'CHILD' && <AccountCard name={user?.name ?? ''} image={user?.image ?? ''} />}
      <div className="flex h-full w-full space-x-5">
        <NavButton {...homeItems[0]} />
        <NavButton {...homeItems[1]} />
      </div>
      <div className="flex h-full w-full space-x-5">
        <NavButton {...homeItems[2]} caseCnt={phishingCount} />
        <NavButton {...homeItems[3]} />
      </div>
    </div>
  );
}

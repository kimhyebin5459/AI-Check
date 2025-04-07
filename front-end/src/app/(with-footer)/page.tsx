'use client';

import { Arrow, Sprout } from '@/public/icons';
import ProfileImage from '@/components/common/ProfileImage';
import ParentAccountCard from '@/components/main/ParentAccountCard';
import NavButton from '@/components/main/NavButton';
import UserListSection from '@/components/main/UserListSection';
import Image from 'next/image';
import AccountCard from '@/components/main/AccountCard';
import Link from 'next/link';
import { CHILD_ITEM, COMMON_ITEM, PARENT_ITEM } from '@/constants/main';
import { UserType } from '@/types/user';
import useGetUserInfo from '@/hooks/query/useGetUserInfo';

export default function Home() {
  const { data: user } = useGetUserInfo();
  const role: UserType = user?.type || 'PARENT';

  const homeItems = [role === 'PARENT' ? PARENT_ITEM : CHILD_ITEM, ...COMMON_ITEM];

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
      {role === 'PARENT' ? (
        <>
          <UserListSection />
          <ParentAccountCard />
        </>
      ) : (
        <AccountCard name={user?.name ?? ''} image={user?.image ?? ''} />
      )}
      <div className="flex h-full w-full space-x-5">
        <NavButton {...homeItems[0]} />
        <NavButton {...homeItems[1]} />
      </div>
      <div className="flex h-full w-full space-x-5">
        <NavButton {...homeItems[2]} />
        <NavButton {...homeItems[3]} />
      </div>
    </div>
  );
}

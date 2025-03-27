import { Arrow, Sprout } from '@/public/icons';
import ProfileImage from '@/components/common/ProfileImage';
import ParentAccountCard from '@/components/main/ParentAccountCard';
import NavButton from '@/components/main/NavButton';
import UserListSection from '@/components/main/UserListSection';
import { user } from '@/mocks/fixtures/user';
import Image from 'next/image';
import ChildAccountCard from '@/components/main/ChildAccountCard';
import Link from 'next/link';

export default function Home() {
  type Role = 'parent' | 'child' | string;
  const role: Role = 'parent';

  const homeItems = [
    role === 'parent'
      ? {
          lines: ['자녀 관리'],
          image: '/images/duck.png',
          color: 'yellow-200',
          to: '/manage-child',
        }
      : {
          lines: ['엄마', '설득하기'],
          image: '/images/duck.png',
          color: 'yellow-200',
          to: '/mother-ai',
        },
    {
      lines: ['용돈', '요청 내역'],
      image: '/images/board.png',
      color: 'gradation1',
      to: '/request',
    },
    {
      lines: ['우리 가족', '피싱 위험'],
      image: '/images/devil.png',
      color: 'gradation1',
      to: '/phishing',
      caseCnt: 0,
    },
    {
      lines: ['송금하기'],
      image: '/images/money.png',
      color: 'yellow-100',
      to: '/transfer',
    },
  ];

  return (
    <div className="container space-y-5 px-5 pb-7">
      <div className="flex w-full items-center justify-start space-x-2">
        {role === 'parent' ? (
          <ProfileImage image={user.image} size="sm" />
        ) : (
          <Image src={Sprout} alt="sprout icon" className="size-7"></Image>
        )}
        <Link href={'/profile'}>
          <div className="flex items-center space-x-1">
            <p className="text-2xl font-bold">{user.name} </p>
            <p className="text-2xl font-medium">님</p>
            <div className="size-7 rotate-180">
              <Image src={Arrow} alt="arrow icon"></Image>
            </div>
          </div>
        </Link>
      </div>
      {role === 'parent' ? (
        <>
          <UserListSection />
          <ParentAccountCard />
        </>
      ) : (
        <ChildAccountCard />
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

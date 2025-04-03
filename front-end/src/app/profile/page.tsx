import Header from '@/components/common/Header';
import ProfileImage from '@/components/common/ProfileImage';
import { user } from '@/mocks/fixtures/user';
import Link from 'next/link';

export default function Page() {
  const { name, birth, image, account } = user;

  return (
    <div className="container space-y-7 bg-gray-50 px-5">
      <Header hasBackButton title="내 정보" hasBorder={false} />
      <div className="space-y-3 pt-10 text-center">
        <ProfileImage image={image} size="xl" />
        <p className="text-2xl font-bold text-gray-800">{name}</p>
      </div>
      <div className="w-full space-y-7 rounded-xl bg-white px-6 py-7">
        <div className="flex w-full items-center">
          <p className="min-w-24 text-xl font-semibold text-gray-600">이름</p>
          <div className="flex w-full justify-between">
            <p className="font-light">{name}</p>
            <Link href={'/profile/edit'} className="-m-2 p-2 font-light text-gray-400">
              변경
            </Link>
          </div>
        </div>
        <div className="flex w-full items-center">
          <p className="min-w-24 text-xl font-semibold text-gray-600">생년월일</p>
          <p className="font-light">{`${birth.slice(0, 4)}.${birth.slice(4, 6)}.${birth.slice(6)}`}</p>
        </div>
        <div className="flex w-full items-start">
          <p className="min-w-24 text-xl font-semibold text-gray-600">연동 계좌</p>
          <div>
            <p className="font-light">{account.no}</p>
            <p className="-mt-1.5 text-sm font-light text-gray-400">{account.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

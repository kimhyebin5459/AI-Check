'use client';

import UserItem from './UserItem';
import Link from 'next/link';
import Plus from '@/public/icons/common/Plus';
import useGetChildProfileList from '@/hooks/query/useGetChildProfileList';

export default function UserListSection() {
  const { data: childList } = useGetChildProfileList();

  if (!childList?.length) {
    return (
      <Link href={'/auth/signup'} className="w-full">
        <div className="shadow-base flex min-h-28 w-full flex-col items-center justify-center rounded-xl bg-yellow-200 px-5 py-3">
          <p className="text-gray-900">아직 등록된 자녀가 없어요</p>
          <p className="text-lg font-bold text-gray-900">자녀 추가하기</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="shadow-base scrollbar-hide flex min-h-28 w-full items-start space-x-4 overflow-x-auto overflow-y-hidden rounded-xl bg-yellow-200 px-5 py-3">
      {childList.map(({ childId, name, image }) => (
        <UserItem key={childId} name={name} image={image} />
      ))}
      <Link href={'/auth/signup'}>
        <div className="flex min-h-15 min-w-15 items-center justify-center rounded-full border-[0.06rem] border-gray-600 bg-white">
          <Plus />
        </div>
      </Link>
    </div>
  );
}

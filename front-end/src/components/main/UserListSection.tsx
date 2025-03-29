import { userList } from '@/mocks/fixtures/user';
import UserItem from './UserItem';
import { Plus } from '@/public/icons';
import Image from 'next/image';

export default function UserListSection() {
  return (
    <div className="shadow-base scrollbar-hide flex min-h-28 w-full items-start space-x-4 overflow-x-auto overflow-y-hidden rounded-xl bg-yellow-200 px-5 py-3">
      {userList.map(({ userId, name, image }) => (
        <UserItem key={userId} name={name} image={image} />
      ))}
      <div className="flex min-h-15 min-w-15 items-center justify-center rounded-full bg-gray-50">
        <Image src={Plus} alt="plus icon" />
      </div>
    </div>
  );
}

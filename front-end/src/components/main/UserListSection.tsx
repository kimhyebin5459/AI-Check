import { userList } from '@/src/mocks/fixtures/user';
import UserItem from './UserItem';
import { Plus } from '@/public/icons';
import Image from 'next/image';

export default function UserListSection() {
  return (
    <div className="flex w-full space-x-4 rounded-xl bg-yellow-200 px-5 py-3 shadow-md">
      {userList.map(({ userId, name, image }) => (
        <UserItem key={userId} name={name} image={image} />
      ))}
      <div className="flex size-13 items-center justify-center rounded-full bg-gray-50">
        <Image src={Plus} alt="plus icon" />
      </div>
    </div>
  );
}

'use client';

import UserItem from '@/components/main/UserItem';
import { formatMoney } from '@/utils/formatMoney';
import { memoRate } from '@/mocks/fixtures/account';
import useGetMyAccount from '@/hooks/query/useGetMyAccount';

interface Props {
  name: string;
  image: string;
}

export default function AccountCard({ name, image }: Props) {
  const { data: account } = useGetMyAccount();
  const { memoCount, totalCount } = memoRate;

  return (
    <div className="shadow-base grid w-full grid-cols-7 rounded-xl border border-yellow-300">
      <div className="col-span-2 w-full rounded-tl-xl rounded-bl-xl bg-yellow-200 py-11">
        <UserItem image={image} name={name} />
      </div>
      <div className="col-span-5 flex w-full flex-col justify-between rounded-tr-xl rounded-br-xl bg-white p-4">
        <p className={`${account?.balance || 0 > 9999999 ? 'text-xl' : 'text-2xl'} font-bold`}>
          {formatMoney(account?.balance)}
        </p>
        <div className="font-light text-gray-900">
          <p>{account?.accountNo}</p>
          <p>{account?.accountName}</p>
        </div>
        <div className="flex items-end justify-end">
          <p className="font-thin">메모 작성률</p>
          <p className="pl-2 text-4xl font-semibold">{memoCount}</p>
          <p className="text-2xl font-semibold">/{totalCount}</p>
        </div>
      </div>
    </div>
  );
}

import { account, memoRate } from '@/src/mocks/fixtures/account';
import { user } from '@/src/mocks/fixtures/user';
import UserItem from './UserItem';
import { formatMoney } from '@/src/utils/formatMoney';

export default function ChildAccountCard() {
  return (
    <div className="grid w-full grid-cols-7 rounded-xl border border-yellow-300">
      <div className="col-span-2 w-full rounded-tl-xl rounded-bl-xl bg-yellow-200 py-11">
        <UserItem image={user.image} name={user.name} />
      </div>
      <div className="col-span-5 flex w-full flex-col justify-between rounded-tr-xl rounded-br-xl bg-white p-4">
        <p className="text-3xl font-bold">{formatMoney(account.balance)}</p>
        <div className="font-light text-gray-900">
          <p>{account.accountNo}</p>
          <p>{account.accountName}</p>
        </div>
        <div className="flex items-end justify-end">
          <p className="font-thin">메모 작성률</p>
          <p className="pl-2 text-4xl font-semibold">{memoRate.memo_count}</p>
          <p className="text-2xl font-semibold">/{memoRate.total_count}</p>
        </div>
      </div>
    </div>
  );
}

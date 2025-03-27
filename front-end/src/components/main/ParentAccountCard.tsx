import { account } from '@/mocks/fixtures/account';
import { formatMoney } from '@/utils/formatMoney';

export default function ParentAccountCard() {
  const { account_name, account_no, balance } = account;

  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-yellow-300 bg-white p-4 shadow-md">
      <div className="flex flex-col leading-5 font-light text-gray-900">
        {account_name}
        <br />
        {account_no}
      </div>
      <p className="text-2xl font-semibold">{formatMoney(balance)}</p>
    </div>
  );
}

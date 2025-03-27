import { account } from '@/src/mocks/fixtures/account';
import { formatMoney } from '@/src/utils/formatMoney';

export default function ParentAccountCard() {
  const { accountName, accountNo, balance } = account;

  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-yellow-300 bg-white p-4 shadow-md">
      <div className="flex flex-col leading-5 font-light text-gray-900">
        {accountName}
        <br />
        {accountNo}
      </div>
      <p className="text-2xl font-semibold">{formatMoney(balance)}</p>
    </div>
  );
}

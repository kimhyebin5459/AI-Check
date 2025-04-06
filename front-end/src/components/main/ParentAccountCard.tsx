'use client';

import useGetMyAccount from '@/hooks/query/useGetMyAccount';
import { formatMoney } from '@/utils/formatMoney';

export default function ParentAccountCard() {
  const { data: account } = useGetMyAccount();

  return (
    <div className="shadow-base flex w-full items-center justify-between rounded-xl border border-yellow-300 bg-white px-3 py-4">
      <div className="flex flex-col leading-5 font-light text-gray-900">
        {account?.accountName}
        <br />
        {account?.accountNo}
      </div>
      <p className={`${account?.balance || 0 > 9999999 ? 'text-xl' : 'text-2xl'} font-semibold whitespace-nowrap`}>
        {formatMoney(account?.balance)}
      </p>
    </div>
  );
}

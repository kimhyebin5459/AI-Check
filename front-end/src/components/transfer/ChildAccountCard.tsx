import { formatMoney } from '@/utils/formatMoney';
import ProfileImage from '../common/ProfileImage';
import Link from 'next/link';
import { ChildAccount } from '@/types/account';

interface Props {
  account: ChildAccount;
}

export default function ChildAccountCard({ account }: Props) {
  const CardContent = () => (
    <>
      <div className="col-span-2 flex items-center justify-center rounded-tl-xl rounded-bl-xl bg-yellow-200">
        <ProfileImage image={account?.image} size="lg" />
      </div>
      <div className="col-span-5 flex flex-col justify-between rounded-tr-xl rounded-br-xl bg-white p-4">
        <div className="flex justify-between">
          <p className="text-xl font-bold">{account?.name}</p>
          {account?.accountNo !== null && (
            <p className={`${account?.balance > 9999999 ? 'text-lg' : 'text-xl'} font-bold`}>
              {formatMoney(account?.balance)}
            </p>
          )}
        </div>
        <div className="flex flex-col font-semibold text-gray-600">
          <p className="text-xs">{account?.accountName}</p>
          <p>{account?.accountNo}</p>
        </div>
      </div>
    </>
  );

  if (account?.accountNo !== null) {
    return (
      <Link
        href={`manage-child/money-check/${account?.memberId}`}
        className="shadow-base mb-4 grid h-28 w-full grid-cols-7 rounded-xl border border-yellow-200"
      >
        <CardContent />
      </Link>
    );
  }

  return (
    <div className="shadow-base mb-4 grid h-28 w-full grid-cols-7 rounded-xl border border-yellow-200">
      <CardContent />
    </div>
  );
}

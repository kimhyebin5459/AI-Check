import { formatMoney } from '@/utils/formatMoney';
import ProfileImage from '../common/ProfileImage';

interface Props {
  image: string;
  name: string;
  balance: number;
  accountNo: string;
  accountName: string;
}

export default function ChildAccountCard({ image, name, balance, accountNo, accountName }: Props) {
  return (
    <div className="shadow-base grid h-28 w-full grid-cols-7 rounded-xl border border-yellow-200">
      <div className="col-span-2 flex items-center justify-center rounded-tl-xl rounded-bl-xl bg-yellow-200">
        <ProfileImage image={image} size="lg" />
      </div>
      <div className="col-span-5 flex flex-col justify-between p-4">
        <div className="flex justify-between">
          <p className="text-xl font-bold">{name}</p>
          <p className="text-2xl font-bold">{formatMoney(balance)}</p>
        </div>
        <div className="flex flex-col font-semibold text-gray-600">
          <p className="text-xs">{accountName}</p>
          <p>{accountNo}</p>
        </div>
      </div>
    </div>
  );
}

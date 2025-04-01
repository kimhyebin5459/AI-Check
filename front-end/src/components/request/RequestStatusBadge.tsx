import { REQUEST_STATUS } from '@/constants/request';
import { StatusType } from '@/types/request';
import clsx from 'clsx';

interface Props {
  status: StatusType;
}

export default function RequestStatusBadge({ status }: Props) {
  return (
    <div
      className={clsx(`w-16 rounded-full text-center`, {
        'bg-green-100 text-green-200': status === 'ACCEPTED',
        'bg-red-100 text-red-200': status === 'REJECTED',
        'bg-yellow-50 text-yellow-400': status === 'WAITING',
      })}
    >
      <p className="font-semibold">{REQUEST_STATUS[status]}</p>
    </div>
  );
}

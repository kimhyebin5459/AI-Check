'use client';

import { Request } from '@/types/request';
import { formatDate } from '@/utils/fotmatDate';
import NotificationBadge from '../notification/NotificationBadge';
import RequestStatusBadge from './RequestStatusBadge';
import { formatMoney } from '@/utils/formatMoney';
import { useRouter } from 'next/navigation';

interface Props {
  request: Request;
  isParent: boolean;
}

export default function RequestCard({ request, isParent }: Props) {
  const router = useRouter();
  const { id, type, status, childName, amount, description, createdAt } = request;

  const handleClick = () => {
    router.push(`/request/${type === '용돈 인상' ? 'increase' : 'transfer'}/${id}`);
  };

  return (
    <div className="w-full space-y-3 rounded-xl bg-white px-5 py-4" onClick={handleClick}>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <NotificationBadge type={type === '용돈 인상' ? 'AIR' : 'AR'} />
          <RequestStatusBadge status={status} />
        </div>
        <p className="text-xs font-thin">{formatDate(createdAt)}</p>
      </div>
      <div>
        <div className="flex">
          {isParent && (
            <div className="flex">
              <p className="font-semibold">{childName}</p>
              <p>님이&nbsp;</p>
            </div>
          )}
          <p className="font-semibold">{formatMoney(amount)}</p>
          <p className="font-light">{type === '용돈 인상' ? <>&nbsp;인상을 요청했어요.</> : '을 요청했어요.'}</p>
        </div>
        <p className="font-thin">사유 : {description}</p>
      </div>
    </div>
  );
}

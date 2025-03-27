import NotificationBadge from './NotificationBadge';
import { formatDate } from '@/utils/fotmatDate';

interface Props {
  type: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationItem({ type, body, isRead, createdAt }: Props) {
  return (
    <div className={`flex w-full flex-col space-y-5 px-4 py-7 ${!isRead ? 'bg-skyblue-50' : 'bg-white'}`}>
      <div className="flex justify-between">
        <NotificationBadge type={type} />
        <p className="font-thin">{formatDate(createdAt)}</p>
      </div>
      <p className="font-light">{body}</p>
    </div>
  );
}

import { NotificationType } from '@/types/notification';
import NotificationBadge from './NotificationBadge';
import { formatDate } from '@/utils/fotmatDate';
import Link from 'next/link';
import { NOTIFICATION_CONFIG } from '@/constants/notificationConfig';

interface Props {
  alarmId: number;
  type: NotificationType;
  body: string;
  isRead: boolean;
  endPointId: number;
  createdAt: string;
  onReadChange: (alarmId: number) => void;
}

export default function NotificationItem({ alarmId, type, body, isRead, endPointId, createdAt, onReadChange }: Props) {
  const handleClick = () => {
    if (!isRead) {
      onReadChange(alarmId);
    }
  };

  return (
    <Link
      href={NOTIFICATION_CONFIG[type].url(endPointId)}
      className={`flex w-full flex-col space-y-5 px-4 py-7 ${!isRead ? 'bg-skyblue-50' : 'bg-white'}`}
      onClick={handleClick}
    >
      <div className="flex justify-between">
        <NotificationBadge type={type} />
        <p className="font-thin">{formatDate(createdAt)}</p>
      </div>
      <p className="font-light">{body}</p>
    </Link>
  );
}

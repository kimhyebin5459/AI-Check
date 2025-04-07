import NotificationBadge from './NotificationBadge';
import { formatDate } from '@/utils/fotmatDate';

interface Props {
  alarmId: number;
  type: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  onReadChange: (alarmId: number) => void;
}

export default function NotificationItem({ alarmId, type, body, isRead, createdAt, onReadChange }: Props) {
  const handleClick = () => {
    if (!isRead) {
      onReadChange(alarmId);
    }
  };

  return (
    <div
      className={`flex w-full flex-col space-y-5 px-4 py-7 ${!isRead ? 'bg-skyblue-50' : 'bg-white'}`}
      onClick={handleClick}
    >
      <div className="flex justify-between">
        <NotificationBadge type={type} />
        <p className="font-thin">{formatDate(createdAt)}</p>
      </div>
      <p className="font-light">{body}</p>
    </div>
  );
}

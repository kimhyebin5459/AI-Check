import { NOTIFICATION_CONFIG } from '@/constants/notificationConfig';
import { NotificationType } from '@/types/notification';
import clsx from 'clsx';

interface Props {
  type: NotificationType;
}

export default function NotificationBadge({ type }: Props) {
  return (
    <div className={clsx(`w-24 rounded-full text-center text-white`, NOTIFICATION_CONFIG[type].color)}>
      <p className="font-semibold">{NOTIFICATION_CONFIG[type].label}</p>
    </div>
  );
}

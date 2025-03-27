import Header from '@/components/common/Header';
import NotificationItem from '@/components/notification/NotificationItem';
import { notificationList } from '@/mocks/fixtures/notification';

export default function Page() {
  return (
    <div className="container">
      <Header title="알림" hasBorder={false} />
      <div className="w-full overflow-y-auto">
        {notificationList.map((noti) => (
          <NotificationItem key={noti.alarmId} {...noti} />
        ))}
      </div>
    </div>
  );
}

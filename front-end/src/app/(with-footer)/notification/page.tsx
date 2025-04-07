'use client';

import Header from '@/components/common/Header';
import NotificationItem from '@/components/notification/NotificationItem';
import Spinner from '@/components/common/Spinner';
import useNotification from '@/hooks/query/useNotification';

export default function Page() {
  const { data: notificationList, isLoading } = useNotification();

  return (
    <div className="container">
      <Header title="알림" hasBorder={false} />
      {isLoading ? (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      ) : (
        <div className="w-full space-y-1 overflow-y-auto">
          {notificationList?.map((noti) => <NotificationItem key={noti.alarmId} {...noti} />)}
        </div>
      )}
    </div>
  );
}

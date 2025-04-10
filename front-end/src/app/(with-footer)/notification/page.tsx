'use client';

import Header from '@/components/common/Header';
import NotificationItem from '@/components/notification/NotificationItem';
import Spinner from '@/components/common/Spinner';
import useNotification from '@/hooks/query/useNotification';
import { patchNotification } from '@/apis/notification';
import { useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/types/notification';

export default function Page() {
  const { data: notificationList, isLoading } = useNotification();
  const queryClient = useQueryClient();

  const handleReadChange = async (alarmId: number) => {
    try {
      await patchNotification(alarmId);

      queryClient.setQueryData(['notifications'], (oldData: Notification[]) =>
        oldData?.map((noti) => (noti.alarmId === alarmId ? { ...noti, isRead: true } : noti))
      );
    } catch (_error) {}
  };

  return (
    <div className="container">
      <Header title="알림" hasBorder />
      {isLoading ? (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      ) : (
        <div className="h-full w-full space-y-1 overflow-y-auto">
          {notificationList && notificationList.length > 0 ? (
            notificationList.map((noti) => (
              <NotificationItem key={noti.alarmId} {...noti} onReadChange={handleReadChange} />
            ))
          ) : (
            <div className="flex h-full w-full items-center justify-center p-8 text-gray-500">아직 알림이 없습니다</div>
          )}
        </div>
      )}
    </div>
  );
}

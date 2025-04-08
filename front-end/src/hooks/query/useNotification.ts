import { useQuery } from '@tanstack/react-query';
import { getNotificationList } from '@/apis/notification';
import { Notification } from '@/types/notification';

const useNotification = () => {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getNotificationList,
  });
};

export default useNotification;

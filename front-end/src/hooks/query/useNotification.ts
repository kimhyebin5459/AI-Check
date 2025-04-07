import { useQuery } from '@tanstack/react-query';
import { getNotificationList } from '@/apis/notification';
import { Notification } from '@/types/notification';

const useNotification = () => {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getNotificationList,
    staleTime: 30 * 1000, // 30초 stale time 설정
  });
};

export default useNotification;

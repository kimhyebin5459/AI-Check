import fetcher from '@/apis/fetcher';
import { Notification } from '@/types/notification';

export const getNotificationList = async (): Promise<Notification[]> => {
  return await fetcher.get({ url: 'alarm' });
};

export const patchNotification = async (alarmId: number) => {
  return await fetcher.patch({ url: 'alarm', body: { alarmId } });
};

export const deleteNotification = async (alarmId: number) => {
  return await fetcher.delete({ url: 'alarm', body: { alarmId } });
};

export const getAlarmCount = async () => {
  return await fetcher.get({ url: 'alarm/check' });
};

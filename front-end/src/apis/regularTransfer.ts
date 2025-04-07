import fetcher from '@/apis/fetcher';
import { RegularTransfer, SchedulePostForm } from '@/types/regularTransfer';

export const getRegularTransferList = async () => {
  const response = await fetcher.get({ url: 'batch/schedules' });
  return response.children as RegularTransfer[];
};

export const postRegularTransfer = async (schedule: SchedulePostForm) => {
  return await fetcher.post({ url: 'batch/schedules', body: schedule });
};

export const patchRegularTransfer = async (scheduleId: number, schedule: SchedulePostForm) => {
  return await fetcher.patch({ url: `batch/schedules/${scheduleId}`, body: schedule });
};

export const deleteRegularTransfer = async (scheduleId: number) => {
  return await fetcher.delete({ url: `batch/schedules/${scheduleId}` });
};

export const getCheckIsRegistered = async (reportId: number) => {
  const response = await fetcher.get({ url: `batch/schedules/check?reportId=${reportId}` });
  return response.check as boolean;
};

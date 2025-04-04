import fetcher from '@/apis/fetcher';
import { RegularTransfer, SchedulePostForm } from '@/types/regularTransfer';

export const getRegulerTransferList = async () => {
  const response = await fetcher.get({ url: 'batch/schedules' });
  return response as RegularTransfer[];
};

export const postRegulerTransfer = async (schedule: SchedulePostForm) => {
  return await fetcher.post({ url: 'batch/schedules', body: schedule });
};

export const patchRegulerTransfer = async ({
  schedule,
  scheduleId,
}: {
  schedule: SchedulePostForm;
  scheduleId: number;
}) => {
  return await fetcher.patch({ url: `batch/schedules/${scheduleId}`, body: schedule });
};

export const deleteRegulerTransfer = async (scheduleId: number) => {
  return await fetcher.delete({ url: `batch/schedules/${scheduleId}` });
};

export const getCheckIsRegistered = async (reportId: number) => {
  const response = await fetcher.get({ url: `batch/schedules/check?reportId=${reportId}` });
  return response.check as boolean;
};

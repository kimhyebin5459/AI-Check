import { RequestType, StatusType } from '@/types/request';

export const REQUEST_TYPE: Record<RequestType, string> = {
  INCREASE: '인상',
  ONE_TIME: '송금',
};

export const REQUEST_STATUS: Record<StatusType, string> = {
  ACCEPTED: '수락',
  REJECTED: '거절',
  WAITING: '대기 중',
};

export interface Notification {
  alarmId: number;
  body: string;
  isRead: boolean;
  type: NotificationType;
  endPointId: number;
  createdAt: string;
}

export enum NotificationType {
  VOICE = 'VOICE',
  URL = 'URL',
  ALLOWANCE_INCREASE = 'ALLOWANCE_INCREASE',
  ALLOWANCE_INCREASE_RESPONSE = 'ALLOWANCE_INCREASE_RESPONSE',
  ALLOWANCE = 'ALLOWANCE',
  ALLOWANCE_RESPONSE = 'ALLOWANCE_RESPONSE',
  REPORT = 'REPORT',
  SCHEDULED_TRANSFER = 'SCHEDULED_TRANSFER',
  TRANSFER = 'TRANSFER',
  TRANSFER_FAILED = 'TRANSFER_FAILED',
}

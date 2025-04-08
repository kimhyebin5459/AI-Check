import { NotificationType } from '@/types/notification';

type NotificationConfig = {
  label: string;
  url: (id: number | null) => string;
  color: string;
};

export const NOTIFICATION_CONFIG: Record<NotificationType, NotificationConfig> = {
  VOICE: {
    label: '보이스피싱',
    url: (_id) => `/phishing/alert`,
    color: 'bg-purple',
  },
  URL: {
    label: '스미싱',
    url: (_id) => `/phishing/alert`,
    color: 'bg-red',
  },
  ALLOWANCE_INCREASE: {
    label: '인상 요청',
    url: (id) => `/request/increase/${id}`,
    color: 'bg-orange',
  },
  ALLOWANCE_INCREASE_RESPONSE: {
    label: '인상 요청',
    url: (id) => `/request/increase/${id}`,
    color: 'bg-orange',
  },
  ALLOWANCE: {
    label: '용돈 요청',
    url: (id) => `/request/transfer/${id}`,
    color: 'bg-periwinkle',
  },
  ALLOWANCE_RESPONSE: {
    label: '용돈 요청',
    url: (id) => `/request/transfer/${id}`,
    color: 'bg-periwinkle',
  },
  REPORT: {
    label: '리포트',
    url: (id) => `/report/${id}`,
    color: 'bg-green',
  },
  SCHEDULED_TRANSFER: {
    label: '정기 송금',
    url: (_id) => `/money-check`,
    color: 'bg-chart-3',
  },
  TRANSFER: {
    label: '송금',
    url: (_id) => `/money-check`,
    color: 'bg-sky',
  },
  TRANSFER_FAILED: {
    label: '송금 실패',
    url: (_id) => `/money-check`,
    color: 'bg-bluegray',
  },
};

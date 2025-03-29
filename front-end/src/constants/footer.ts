import {
  ActiveBoard,
  ActiveHome,
  ActiveNotification,
  InactiveBoard,
  InactiveHome,
  InactiveNotification,
} from '@/public/icons';

export const FOOTER = [
  {
    activeIcon: ActiveBoard,
    inactiveIcon: InactiveBoard,
    label: '가계부',
    to: '/money-check',
  },
  {
    activeIcon: ActiveHome,
    inactiveIcon: InactiveHome,
    label: '홈',
    to: '/',
  },
  {
    activeIcon: ActiveNotification,
    inactiveIcon: InactiveNotification,
    label: '알림',
    to: '/notification',
  },
];

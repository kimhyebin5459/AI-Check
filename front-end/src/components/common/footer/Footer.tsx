'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ActiveBoard,
  ActiveHome,
  ActiveNotification,
  InactiveBoard,
  InactiveHome,
  InactiveNotification,
} from '@/public/icons';
import FooterItem from './FooterItem';

export default function Footer() {
  const path = usePathname();

  const footerItems = [
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

  return (
    <nav className="fixed-container bottom-0 h-[5.5rem] border-t-1 border-gray-300 bg-white">
      <div className="flex w-full justify-between space-x-4 px-10 pt-2.5">
        {footerItems.map(({ activeIcon, inactiveIcon, label, to }) => {
          const isActive = path === to;
          return (
            <Link key={label} href={to}>
              <FooterItem icon={isActive ? activeIcon : inactiveIcon} label={label} isActive={isActive} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

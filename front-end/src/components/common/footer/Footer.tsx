'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FooterItem from '@/components/common/footer/FooterItem';
import { FOOTER } from '@/constants/footer';
import { getAlarmCount } from '@/apis/notification';

export default function Footer() {
  const path = usePathname();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const count = await getAlarmCount();
        setNotificationCount(count);
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
      }
    };

    fetchNotificationCount();

    const intervalId = setInterval(fetchNotificationCount, 10000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="fixed-container bottom-0 h-[5.5rem] border-t-1 border-gray-300 bg-white">
      <div className="flex w-full justify-between space-x-4 px-10 pt-2.5">
        {FOOTER.map(({ activeIcon, inactiveIcon, label, to }) => {
          const isActive = path === to;
          const showNotification = label === '알림' || label === 'Notifications'; // Adjust based on your actual label

          return (
            <Link key={label} href={to}>
              <FooterItem
                icon={isActive ? activeIcon : inactiveIcon}
                label={label}
                isActive={isActive}
                notificationCount={showNotification ? notificationCount : 0}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FooterItem from '@/components/common/footer/FooterItem';
import { FOOTER } from '@/constants/footer';

export default function Footer() {
  const path = usePathname();

  return (
    <nav className="fixed-container bottom-0 h-[5.5rem] border-t-1 border-gray-300 bg-white">
      <div className="flex w-full justify-between space-x-4 px-10 pt-2.5">
        {FOOTER.map(({ activeIcon, inactiveIcon, label, to }) => {
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

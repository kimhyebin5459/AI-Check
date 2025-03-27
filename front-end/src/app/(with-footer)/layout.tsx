'use client';

import Footer from '@/components/common/footer/Footer';
import { usePathname } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const path = usePathname();

  return (
    <div className={`h-screen pt-16 pb-[5.5rem] ${path === '/' ? 'bg-gradation2' : 'bg-white'}`}>
      {children}
      <Footer />
    </div>
  );
}

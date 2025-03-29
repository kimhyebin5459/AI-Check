import type { Metadata } from 'next';
import '../styles/globals.css';
import { MSWComponent } from './_components/msw-component';
import { Suspense } from 'react';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'AICheck',
  description: '가족 안심 자녀 금융 서포트 서비스',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <body className="mx-auto my-0 h-dvh max-w-[480px] min-w-[320px] bg-white px-0 shadow-md">
        <MSWComponent>
          <Suspense>{children}</Suspense>
        </MSWComponent>
      </body>
    </html>
  );
}

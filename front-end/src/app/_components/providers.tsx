'use client';

import { authBridge } from '@/apis/authBridge';
import { useUserStore } from '@/stores/useUserStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import LoadingComponent from './loading-component';

interface Props {
  children?: ReactNode;
}

export default function Providers({ children }: Props) {
  const pathname = usePathname();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 6 * 1000,
            retry: 0,
          },
        },
      })
  );

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname.startsWith('/auth')) {
      setChecked(true);
      return;
    }

    const accessToken = authBridge.getAccessToken();

    if (!accessToken) {
      window.location.href = '/auth/signin';
    } else {
      useUserStore.getState().setAccessToken(accessToken);
      setChecked(true);
    }
  }, [pathname]);

  if (!checked) return <LoadingComponent />;

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

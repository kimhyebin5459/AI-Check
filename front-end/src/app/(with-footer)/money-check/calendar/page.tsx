'use client';

import { useSearchParams } from 'next/navigation';

export default function Page() {
  const params = useSearchParams();
  const year = params.get('year') || new Date().getFullYear().toString();
  const month = params.get('month') || (new Date().getMonth() + 1).toString().padStart(2, '0');

  return (
    <div>
      Calendar for {year}/{month}
    </div>
  );
}

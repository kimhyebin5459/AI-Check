'use client';

import { useSearchParams } from 'next/navigation';

export default function Page() {
  const params = useSearchParams();
  const recordId = params.get('id') || (new Date().getMonth() + 1).toString().padStart(2, '0');

  return <div>Group for {recordId}</div>;
}

'use client';

import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || new Date().getFullYear().toString();

  return <div>Detail for {id}</div>;
}

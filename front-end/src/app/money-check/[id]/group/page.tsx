import { use } from 'react';

interface PageParams {
  id: string;
}

export default function GroupPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  return <div>ID: {resolvedParams.id}</div>;
}

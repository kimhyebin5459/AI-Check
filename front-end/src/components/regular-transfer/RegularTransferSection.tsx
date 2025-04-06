'use client';

import ErrorComponent from '@/app/_components/error-component';
import LoadingComponent from '@/app/_components/loading-component';
import RegularTransferItem from '@/components/regular-transfer/RegularTransferItem';
import useGetRegularTransferList from '@/hooks/query/useGetRegularTransferList';

export default function RegularTransferSection() {
  const { data: regularTransferList, isPending, isError } = useGetRegularTransferList();

  if (isPending) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return (
    <div className="w-full overflow-y-auto px-5">
      {regularTransferList?.map((schedule, index) => (
        <div key={schedule.childId}>
          <RegularTransferItem schedule={schedule} index={index} />
          <div
            className={`w-full ${index < regularTransferList.length - 1 ? 'border-[0.03rem] border-gray-200' : ''} `}
          ></div>
        </div>
      ))}
    </div>
  );
}

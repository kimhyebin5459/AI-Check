import clsx from 'clsx';

interface Props {
  status: string;
}

const statusType: Record<string, string> = {
  ACCEPTED: '수락',
  REJECTED: '거절',
  WAITING: '대기 중',
};

export default function RequestStatusBadge({ status }: Props) {
  return (
    <div
      className={clsx(`w-16 rounded-full text-center`, {
        'bg-green-100 text-green-200': status === 'ACCEPTED',
        'bg-red-100 text-red-200': status === 'REJECTED',
        'bg-yellow-50 text-yellow-400': status === 'WAITING',
      })}
    >
      <p className="font-semibold">{statusType[status]}</p>
    </div>
  );
}

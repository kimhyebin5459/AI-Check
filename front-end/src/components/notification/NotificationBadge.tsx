import clsx from 'clsx';

interface Props {
  type: string;
}

const notiType: Record<string, string> = {
  VOICE: '피싱',
  URL: '스미싱',
  AIR: '용돈 인상',
  AR: '용돈 요청',
  REPORT: '리포트',
};

export default function NotificationBadge({ type }: Props) {
  return (
    <div
      className={clsx(`w-20 rounded-full text-center text-white`, {
        'bg-purple': type === 'VOICE',
        'bg-periwinkle': type === 'AR',
        'bg-orange': type === 'AIR',
        'bg-red': type === 'URL',
        'bg-green': type === 'REPORT',
      })}
    >
      <p className="font-semibold">{notiType[type]}</p>
    </div>
  );
}

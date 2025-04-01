import clsx from 'clsx';

interface Props {
  type: string;
}

const statusType: Record<string, string> = {
  URL: '악성 URL 감지',
  VOICE: '피싱 전화 감지',
};

export default function PhishingBadge({ type }: Props) {
  return (
    <div
      className={clsx(`w-32 rounded-full text-center`, {
        'bg-red text-white': type === 'URL',
        'bg-purple text-white': type === 'VOICE',
      })}
    >
      <p className="font-semibold">{statusType[type]}</p>
    </div>
  );
}

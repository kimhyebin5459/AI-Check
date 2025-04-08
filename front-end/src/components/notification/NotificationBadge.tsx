import clsx from 'clsx';

interface Props {
  type: string;
}

const notiType: Record<string, string> = {
  VOICE: '피싱',
  URL: '스미싱',

  ALLOWANCE_INCREASE: '용돈 인상 요청',
  ALLOWANCE_INCREASE_RESPONSE: '용돈 인상 요청 결과',
  ALLOWANCE: '용돈 요청',
  ALLOWANCE_RESPONSE: '용돈 요청 결과',

  REPORT: '리포트',
  SCHEDULED_TRANSFE: '정기 송금',
  TRANSFER: '송금',
  TRANSFER_FAILED: '송금 실패',
};

// type : VOICE(보이스 피싱), URL(스미싱), ALLOWANCE_INCREASE(용돈 인상 요청), ALLOWANCE_INCREASE_RESPONSE(용돈 인상 요청 응답),
// 	ALLOWANCE(용돈 요청), ALLOWANCE_RESPONSE(용돈 요청 응답), REPORT(리포트), SCHEDULED_TRANSFER(정기 송금), TRANSFER(송금), TRANSFER_FAILED(송금 실패 (금액 부족))

export default function NotificationBadge({ type }: Props) {
  return (
    <div
      className={clsx(`rounded-full px-3 text-center text-white`, {
        'bg-purple': type === 'VOICE' || type === 'URL',
        'bg-periwinkle': type === 'SCHEDULED_TRANSFE' || type === 'TRANSFER',
        'bg-orange':
          type === 'ALLOWANCE_INCREASE' ||
          type === 'ALLOWANCE_INCREASE_RESPONSE' ||
          type === 'ALLOWANCE' ||
          type === 'ALLOWANCE_RESPONSE',
        'bg-red': type === 'TRANSFER_FAILED',
        'bg-green': type === 'REPORT',
      })}
    >
      <p className="font-semibold">{notiType[type]}</p>
    </div>
  );
}

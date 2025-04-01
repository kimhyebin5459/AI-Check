import { formatDate } from '@/utils/fotmatDate';
import PhishingBadge from './PhishingBadge';

interface Props {
  id: number;
  displayName: string;
  type: string;
  url: string | null;
  phoneNumber: string | null;
  score: number;
  createdAt: string;
}

export default function PhishingCard({ displayName, type, url, phoneNumber, score, createdAt }: Props) {
  const formattedDate = formatDate(createdAt);
  const scorePercentage = Math.round(score * 10);

  return (
    <div className="mb-3 cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <PhishingBadge type={type === 'URL' ? 'URL' : 'VOICE'} />
        </div>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>

      <h3 className="mb-2 text-lg font-medium">
        {displayName} 님이 {type === 'URL' ? '피싱 링크를' : '피싱 의심 전화를'} 받았어요.
      </h3>

      <div className="mt-3 text-sm">
        {type === 'URL' && url && (
          <div className="mb-2 gap-1 text-right break-all text-gray-600">
            <span className="font-medium">악성 URL:</span> {url}
          </div>
        )}

        {type === 'VOICE' && phoneNumber && (
          <div className="flex justify-between text-right text-gray-600">
            <div className="flex items-center gap-1">
              <span>피싱 확률:</span>
              <div className="text-red-500">{scorePercentage}%</div>
            </div>
            <div>
              <span className="mr-2 font-medium">피싱 전화번호: {phoneNumber} </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

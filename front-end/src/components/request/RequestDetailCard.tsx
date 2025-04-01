import { formatMoney } from '@/utils/formatMoney';
import ProfileImage from '@/components/common/ProfileImage';
import RequestDescription from '@/components/request/RequestDescription';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import IncreaseBadge from './IncreaseBadge';
import { REQUEST_STATUS, REQUEST_TYPE } from '@/constants/request';
import { RequestType, StatusType } from '@/types/request';
import { UserType } from '@/types/user';

interface Props {
  id: number;
  childName: string;
  image: string;
  type: RequestType;
  status: StatusType;
  description: string;
  prevAmount?: number;
  amount: number;
}

export default function RequestDetailCard({
  id,
  childName,
  image,
  type,
  description,
  prevAmount,
  amount,
  status,
}: Props) {
  const role: UserType = 'PARENT';
  const router = useRouter();

  const handleClickReject = () => {
    console.log(id, 'REJECTED');
    router.refresh();
  };

  const handleClickAccept = () => {
    console.log(id, 'ACCPETED');
    router.refresh();
  };

  return (
    <div className="rounded-modal w-full space-y-5 bg-white p-6">
      <div className="flex flex-col items-center text-xl">
        <RequestDescription text={description} />
        <ProfileImage image={image} size="md" />
        <div className="flex flex-col items-center pt-3 text-lg">
          <div className="flex space-x-1">
            <p className="font-semibold">{childName}</p>
            <p className="font-light">님의</p>
          </div>
          <div className="flex">
            <p className="font-semibold whitespace-nowrap text-yellow-400">
              {formatMoney(prevAmount ? amount - prevAmount : amount)}&nbsp;
            </p>
            <p className="font-light whitespace-nowrap">
              {REQUEST_TYPE[type]}&nbsp;요청이 {REQUEST_STATUS[status]}
              {status === 'WAITING' ? '이에요' : '되었어요'}
            </p>
          </div>
        </div>
        {prevAmount && (
          <div className="flex items-end pt-3">
            <IncreaseBadge type="before" amount={prevAmount} />
            <p className="size-8 text-center text-gray-400">→</p>
            <IncreaseBadge type="after" amount={amount} />
          </div>
        )}
      </div>
      {status === 'WAITING' && role === 'PARENT' && (
        <div className="flex space-x-4">
          <Button onClick={handleClickReject} variant="secondary">
            거절
          </Button>
          <Button onClick={handleClickAccept}>수락</Button>
        </div>
      )}
    </div>
  );
}

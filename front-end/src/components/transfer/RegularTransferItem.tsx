import { formatMoney } from '@/utils/formatMoney';
import ProfileImage from '../common/ProfileImage';
import Button from '../common/Button';
import { formatTransferPlan } from '@/utils/formatTransferPlan';

interface Props {
  childName: string;
  image: string;
  amount: number | null;
  interval: string | null;
  day: string | null;
}

export default function RegularTransferItem({ childName, image, amount, interval, day }: Props) {
  return (
    <div className="flex h-64 w-full flex-col justify-between p-5">
      <div className="flex w-full items-center justify-start space-x-4">
        <ProfileImage size="md" image={image} />
        <p className="text-2xl font-bold">{childName}</p>
      </div>
      {typeof interval === 'string' ? (
        <>
          <div className="flex flex-col space-y-3 font-semibold">
            <div className="flex justify-between">
              <p>송금 일정</p>
              <p>{formatTransferPlan(interval, day as string)}</p>
            </div>
            <div className="flex justify-between">
              <p>금액</p>
              <p>{formatMoney(amount as number)}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="secondary">취소</Button>
            <Button>수정</Button>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-xl font-semibold text-gray-600">등록된 정기 송금이 없어요</p>
        </div>
      )}
    </div>
  );
}

'use client';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import ReportSummaryCard from '@/components/report/ReportSummaryCard';
import usePostIncreaseRequest from '@/hooks/query/usePostIncreaseRequest';
import useInput from '@/hooks/useInput';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();

  const { value: amount, onChange: onChangeAmount } = useInput<number>(0);
  const { value: description, onChange: onChangeDescription } = useInput<string>('');

  const { mutate: createIncreaseRequest } = usePostIncreaseRequest();

  const reportId = searchParams.get('reportId') || '';
  const childId = Number(searchParams.get('childId'));

  const handleClick = () => {
    createIncreaseRequest({ reportId, increaseAmount: amount, reason: description });
  };

  return (
    <div className="container px-5">
      <Header hasBackButton hasBorder={false} title="용돈 인상 요청 보내기" />
      <div className="flex w-full flex-col items-center space-y-5 pt-4">
        {reportId && <ReportSummaryCard reportId={reportId} childId={childId} />}
        <Input
          type="number"
          label="인상 금액"
          value={amount > 0 ? amount.toString() : ''}
          onChange={onChangeAmount}
          maxLength={12}
          placeholder="얼마를 인상할까요?"
        />
        <Input
          label="요청 사유"
          placeholder="15자 이내 입력"
          value={description}
          onChange={onChangeDescription}
          maxLength={15}
        />
      </div>
      {amount > 0 && description && (
        <div className="bottom-btn">
          <Button onClick={handleClick}>보내기</Button>
        </div>
      )}
    </div>
  );
}

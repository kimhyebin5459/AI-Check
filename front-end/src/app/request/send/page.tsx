'use client';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import ReportSummaryCard from '@/components/report/ReportSummaryCard';
import usePostIncreaseRequest from '@/hooks/query/usePostIncreaseRequest';
import useInput from '@/hooks/useInput';
import useModal from '@/hooks/useModal';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const searchParams = useSearchParams();

  const { isModalOpen, openModal, closeModal } = useModal(); // 모달 상태 관리
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { value: amount, onChange: onChangeAmount } = useInput<number>(0);
  const { value: description, onChange: onChangeDescription } = useInput<string>('');

  const { mutate: createIncreaseRequest, error, isError, clearError } = usePostIncreaseRequest();

  const reportId = searchParams.get('reportId') || '';
  const childId = Number(searchParams.get('childId'));

  useEffect(() => {
    if (isError && error) {
      openModal();
    }
  }, [isError, error, openModal]);

  const handleClick = () => {
    createIncreaseRequest({ reportId, increaseAmount: amount, reason: description });
  };

  const handleCloseModal = () => {
    closeModal();
    clearError(); // 에러 상태 초기화
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <div className="container px-5 pb-20">
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
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {amount > 0 && description && !isInputFocused && (
          <div className="mt-8 w-full">
            <Button onClick={handleClick}>보내기</Button>
          </div>
        )}
      </div>

      {/* 키보드 올라와 있을 때는 fixed 버튼 대신 컨텐츠 내에 버튼 표시 */}
      {amount > 0 && description && isInputFocused && (
        <div className="mt-4 w-full px-5">
          <Button onClick={handleClick}>보내기</Button>
        </div>
      )}

      {/* 키보드가 내려갔을 때만 fixed 버튼 표시 */}
      {amount > 0 && description && !isInputFocused && (
        <div className="bottom-btn">
          <Button onClick={handleClick}>보내기</Button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="인상 요청 실패 😢">
        <div className="text-left">
          <p className="text-lg">Tip!</p>
          <p className="text-gray-900">
            용돈이 더 필요하다면, <span className="font-bold">부모님께 요청하기</span>를 이용해 보세요!
          </p>
          <Button onClick={handleCloseModal} className="mt-4">
            확인
          </Button>
        </div>
      </Modal>
    </div>
  );
}

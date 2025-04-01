'use client';

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import SettingsModal from '@/components/mother-ai/SettingsModal';
import ChildSelectModal from '@/components/mother-ai/ChildSelectModal';
import useModal from '@/hooks/useModal';
import { useRouter } from 'next/navigation';
import NoticePage from '@/components/common/NoticePage';
import { useDifficultySettings } from '@/contexts/DifficultyContext';

interface Props {
  childId: string;
  children?: React.ReactNode;
}

export default function MotherAIClient({ children }: Props) {
  const router = useRouter();
  const { isModalOpen: isSettingsModalOpen, openModal: openSettingsModal, closeModal: closeSettingsModal } = useModal();
  const { isModalOpen: isChildModalOpen, openModal: openChildModal, closeModal: closeChildModal } = useModal();

  const { saveSettings, copySettingsFromChild, error: contextError } = useDifficultySettings();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 설정 완료 후 처리
  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    console.log('good');

    try {
      const success = await saveSettings();
      if (success) {
        setIsSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '설정 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoticeClose = () => {
    // 저장 후 목록 페이지로 이동
    router.push('/mother-ai/list');
  };

  const handleCopySettings = async (sourceChildId: string) => {
    try {
      await copySettingsFromChild(sourceChildId);
      closeChildModal();
    } catch (err) {
      // 에러는 context에서 이미 처리됨
      closeChildModal();
    }
  };

  // 성공 화면 표시
  if (isSuccess) {
    return (
      <NoticePage
        title="설정이 저장되었습니다"
        message="새로운 설정이 적용되었습니다."
        iconType="success"
        buttonText="확인"
        onButtonClick={handleNoticeClose}
      />
    );
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">설득 난이도 설정</h2>
        <div className="flex space-x-2">
          <button
            className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
            onClick={openChildModal}
          >
            불러오기
          </button>
          <button
            className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-500"
            onClick={openSettingsModal}
          >
            ?
          </button>
        </div>
      </div>

      {/* DifficultySettings 컴포넌트가 렌더링되는 위치 */}
      {children}

      {(error || contextError) && (
        <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-red-500">
          {error || contextError}
        </div>
      )}

      <div className="mt-8">
        <Button onClick={handleConfirm} isDisabled={isLoading}>
          {isLoading ? '저장 중...' : '확인'}
        </Button>
      </div>

      <SettingsModal isOpen={isSettingsModalOpen} onClose={closeSettingsModal} />

      <ChildSelectModal isOpen={isChildModalOpen} onClose={closeChildModal} onSelect={handleCopySettings} />
    </>
  );
}

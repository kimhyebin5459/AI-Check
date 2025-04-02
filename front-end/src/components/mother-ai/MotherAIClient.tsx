'use client';

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import SettingsModal from '@/components/mother-ai/SettingsModal';
import ChildSelectModal from '@/components/mother-ai/ChildSelectModal';
import useModal from '@/hooks/useModal';
import { useRouter } from 'next/navigation';
import NoticePage from '@/components/common/NoticePage';
import { useDifficultySettings } from '@/hooks/useDifficultySettings';

interface Props {
  childId: string;
  children?: React.ReactNode;
}

export default function MotherAIClient({ childId, children }: Props) {
  const router = useRouter();
  const { isModalOpen: isSettingsModalOpen, openModal: openSettingsModal, closeModal: closeSettingsModal } = useModal();
  const { isModalOpen: isChildModalOpen, openModal: openChildModal, closeModal: closeChildModal } = useModal();

  const { saveSettings, copySettingsFromChild, error, clearError } = useDifficultySettings();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    clearError();

    try {
      const success = await saveSettings();
      if (success) {
        setIsSuccess(true);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoticeClose = () => {
    router.push('/mother-ai/list');
  };

  const handleCopySettings = async (sourceChildId: string) => {
    try {
      await copySettingsFromChild(sourceChildId);
      closeChildModal();
    } catch {
      closeChildModal();
    }
  };

  if (isSuccess) {
    return (
      <div className="mb-5 h-full w-full items-center justify-between">
        <NoticePage
          title="설정이 저장되었습니다"
          message="새로운 설정이 적용되었습니다."
          iconType="success"
          buttonText="확인"
          onButtonClick={handleNoticeClose}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">설득 난이도 설정</h2>
        <div className="flex h-full space-x-2">
          <button className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium" onClick={openChildModal}>
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

      {children}

      {error && (
        <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-red-500">{error}</div>
      )}

      <div className="mt-8">
        <Button onClick={handleConfirm} isDisabled={isLoading}>
          {isLoading ? '저장 중...' : '확인'}
        </Button>
      </div>

      <SettingsModal isOpen={isSettingsModalOpen} onClose={closeSettingsModal} />

      <ChildSelectModal
        isOpen={isChildModalOpen}
        onClose={closeChildModal}
        onSelect={handleCopySettings}
        currentChildId={childId} // 현재 자녀 ID 전달
      />
    </div>
  );
}

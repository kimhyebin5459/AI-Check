'use client';

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import SettingsModal from '@/components/mother-ai/SettingsModal';
import ChildSelectModal from '@/components/mother-ai/ChildSelectModal';
import useModal from '@/hooks/useModal';
import { useRouter } from 'next/navigation';
import NoticePage from '@/components/common/NoticePage';
import { useDifficultyStore } from '@/stores/useDifficultyStore';

interface Props {
  children?: React.ReactNode;
}

export default function MotherAIClient({ children }: Props) {
  const router = useRouter();
  const { isModalOpen: isSettingsModalOpen, openModal: openSettingsModal, closeModal: closeSettingsModal } = useModal();
  const { isModalOpen: isChildModalOpen, openModal: openChildModal, closeModal: closeChildModal } = useModal();

  const { saveSettings, copySettingsFromChild, error, clearError } = useDifficultyStore();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    clearError();

    try {
      await saveSettings();
      setIsSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildSelect = async (sourceChildId: string) => {
    try {
      await copySettingsFromChild(sourceChildId);
      closeChildModal();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {}
  };

  const handleNoticeClose = () => {
    router.push('/mother-ai/list');
  };

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

      <ChildSelectModal isOpen={isChildModalOpen} onClose={closeChildModal} onSelect={handleChildSelect} />
    </>
  );
}

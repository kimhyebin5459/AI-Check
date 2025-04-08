'use client';

import ChatInterface from '@/components/chat/ChatInterface';
import Header from '@/components/common/Header';
import { useRouter } from 'next/navigation';
import useChatStore from '../../stores/useChatStore';
import { useState } from 'react';
import CloseModal from '@/components/chat/CloseModal';

export default function ChatPage() {
  const router = useRouter();
  const [isCloseModalOpened, setIsCloseModalOpened] = useState<boolean>(false);

  const { state, resetState, endChat, session } = useChatStore();

  // 채팅 나가기 확인
  const closeCheck = () => {
    if (state !== 'PROCEEDING') {
      // 이미 종료된 상태면 바로 나가기
      resetState();
      router.replace('/');
      return;
    }
    // 진행 중이면 확인 모달 표시
    setIsCloseModalOpened(true);
  };

  // 확인 후 나가기 (endChat API 호출 추가)
  const handleConfirmClose = async () => {
    if (session?.isActive && state === 'PROCEEDING') {
      await endChat(); // 채팅 강제 종료 API 호출
    }
    resetState();
    router.replace('/');
  };

  return (
    <div className="h-full pb-[139px]">
      <div className="container">
        <Header
          title="엄마 설득하기"
          hasBackButton
          onBackClick={() => {
            closeCheck();
          }}
        />
        <main className="scrollbar-hide w-full flex-1 overflow-y-auto">
          <ChatInterface onClickClose={closeCheck} />
        </main>
      </div>
      <CloseModal
        isModalOpen={isCloseModalOpened}
        onClose={handleConfirmClose}
        onContinue={() => setIsCloseModalOpened(false)}
      ></CloseModal>
    </div>
  );
}

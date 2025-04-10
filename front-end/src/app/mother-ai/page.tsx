'use client';

import ChatInterface from '@/components/chat/ChatInterface';
import Header from '@/components/common/Header';
import { useRouter } from 'next/navigation';
import useChatStore from '../../stores/useChatStore';
import { useState } from 'react';
import CloseModal from '@/components/chat/CloseModal';

export default function Page() {
  const router = useRouter();
  const [isCloseModalOpened, setIsCloseModalOpened] = useState<boolean>(false);

  const { state, resetState, endChat, session } = useChatStore();

  // 채팅 나가기 확인
  const closeCheck = () => {
    if (state !== 'PROCEEDING') {
      resetState();
      router.replace('/');
      return;
    }
    setIsCloseModalOpened(true);
  };

  const handleConfirmClose = async () => {
    if (session?.isActive && state === 'PROCEEDING') {
      await endChat();
    }
    resetState();
    router.replace('/');
  };

  return (
    <div className="h-full w-full pb-[5.5rem]">
      <div className="container">
        <Header
          title="부모님께 요청하기"
          hasBackButton
          onBackClick={() => {
            closeCheck();
          }}
        />
        <main className="scrollbar-hide h-full w-full overflow-y-auto">
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

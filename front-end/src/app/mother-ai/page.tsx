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

  const { state, resetState } = useChatStore();

  const closeCheck = () => {
    if (state !== 'PROCEEDING') {
      resetState();
      router.replace('/');
      return;
    }
    setIsCloseModalOpened(true);
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
        onClose={() => {
          resetState();
          router.replace('/');
        }}
        onContinue={() => setIsCloseModalOpened(false)}
      ></CloseModal>
    </div>
  );
}

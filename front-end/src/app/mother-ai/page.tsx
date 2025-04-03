'use client';

import ChatInterface from '@/components/chat/ChatInterface';
import Header from '@/components/common/Header';
import { useRouter } from 'next/navigation';
import useChatStore from '../stores/useChatStore';
import { useState } from 'react';
import CloseModal from '@/components/chat/CloseModal';

export default function ChatPage() {
  const router = useRouter();
  const [isCloseModalOpened, setIsCloseModalOpened] = useState<boolean>(false);

  const { state, resetState } = useChatStore();

  const closeCheck = () => {
    if (state !== 'PROCEEDING') {
      router.replace('/');
      return;
    }
    setIsCloseModalOpened(true);
  };

  return (
    <div className="h-full" aria-disabled={state === 'FINISHED'}>
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
        <div className="border-t bg-white p-4 text-center text-sm text-gray-500">
          <p>5분 동안 활동이 없으면 대화가 자동으로 종료됩니다.</p>
        </div>
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

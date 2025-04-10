'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useChatStore from '@/stores/useChatStore';
import { formatDateToParam } from '@/utils/fotmatDate';
import ChatChooser from './ChatChooser';
import ChatBubble from '@/components/chat/ChatBubble';
import ResultModal from './ResultModal';
import { X } from 'lucide-react';
import { LoadingBubble } from './LoadingBubble';

interface Props {
  onClickClose: () => void;
}

// 입력창 최대 글자 수 제한
const MAX_MESSAGE_LENGTH = 200;

export default function ChatInterface({ onClickClose }: Props) {
  const router = useRouter();
  const { session, isLoading, state, sendMessage, updateLastActivity, resetState } = useChatStore();

  const [message, setMessage] = useState('');
  const [isResultModalOpened, setIsResultModalOpened] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때 스크롤 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, isLoading]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session?.isActive) {
        // 페이지가 다시 활성화되면 타이머 재설정
        updateLastActivity();
      }
    };

    const handleFocus = () => {
      if (session?.isActive) {
        updateLastActivity();
      }
    };

    // 사용자 활동 이벤트 리스너
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [session?.isActive, updateLastActivity]);

  // 비활성 타임아웃 체크
  useEffect(() => {
    const checkInactivityInterval = setInterval(() => {
      useChatStore.getState().checkInactivity();
    }, 60000);

    return () => {
      clearInterval(checkInactivityInterval);
    };
  }, []);

  // 입력 메시지 변경 핸들러 (글자 수 제한 적용)
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // 최대 길이 제한
    if (inputValue.length <= MAX_MESSAGE_LENGTH) {
      setMessage(inputValue);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // 메시지 내용 저장 후 즉시 입력창 비우기
    const messageToSend = message.trim();
    setMessage('');

    await sendMessage(messageToSend);
  };

  useEffect(() => {
    setIsResultModalOpened(state === 'FINISHED');
  }, [state, setIsResultModalOpened]);

  const handleCloseButton = () => {
    onClickClose();
  };

  // 남은 글자 수 계산
  const remainingChars = MAX_MESSAGE_LENGTH - message.length;

  return (
    <div className="w-full">
      <div className="flex h-full w-full flex-col">
        <div className="mt-4 text-center text-gray-500">{formatDateToParam(new Date()).replaceAll('-', '/')}</div>
        <div className="bg-white p-2 text-center text-sm text-gray-500">
          <p>5분 동안 활동이 없으면 대화가 자동으로 종료됩니다.</p>
        </div>
        <ChatChooser />

        <div>
          <div className="flex flex-col overflow-auto px-4">
            {!!session &&
              session.messages.map((msg) => <ChatBubble key={msg.id} role={msg.role} content={msg.content} />)}
            {isLoading && <LoadingBubble />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 w-full bg-white px-4 pt-2 pb-4">
        <div className="mt-2 mb-2 flex justify-start">
          <button onClick={handleCloseButton} className="rounded-full bg-yellow-300 px-3 py-1.5 text-sm text-white">
            <div className="flex items-center justify-center">
              <span>대화 종료하기 </span> <X size={20} />
            </div>
          </button>
        </div>
        <form onSubmit={handleSendMessage} className="flex w-full items-center">
          <div className="flex w-full items-center">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="여기에 내용을 입력하세요"
              className="flex-1 rounded-full border border-yellow-100 bg-yellow-50 px-4 py-3 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
              disabled={isLoading || state === 'FINISHED' || state === 'BEFORE'}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <button
              type="submit"
              className="bg-skyblue-200 disabled:bg-skyblue-100 ml-2 rounded-full p-3 text-white"
              disabled={isLoading || !message.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <div className="mt-1 w-full text-right text-xs text-gray-500">
            {remainingChars}/{MAX_MESSAGE_LENGTH}자
          </div>
        </form>
      </div>

      <ResultModal
        isModalOpen={isResultModalOpened}
        onClose={() => setIsResultModalOpened(false)}
        onGoToRequest={() => {
          router.push('/request');
          resetState();
        }}
      ></ResultModal>
    </div>
  );
}

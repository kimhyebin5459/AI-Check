import { useEffect, useState } from 'react';
import { ChatType } from '@/types/chat';
import useChatStore from '@/app/stores/useChatStore';
import ChatBubble from './ChatBubble';
import { useUserStore } from '@/app/stores/useUserStore';

export default function ChatChooser() {
  const [selectedType, setSelectedType] = useState<ChatType | null>(null);

  const { session, startChat } = useChatStore();
  const { userName } = useUserStore();

  useEffect(() => {
    if (!selectedType) return;
    startChat(selectedType);
  }, [selectedType, startChat]);

  return (
    <div className="mx-auto flex w-full flex-col p-4">
      <div className="mb-6 flex flex-col space-y-4">
        <ChatBubble role="AI" content={`${userName}아, 무슨 일이야?`}></ChatBubble>
        <div className="bg-skyblue-100 ml-12 flex w-fit flex-col gap-3 rounded-2xl p-3 text-base">
          <button
            className={`rounded-xl border p-3 ${selectedType === 'PERSUADE' || session?.chatType === 'PERSUADE' ? 'border-yellow-300 bg-yellow-100' : 'border-gray-200 bg-white'}`}
            onClick={() => {
              setSelectedType('PERSUADE');
            }}
            disabled={!!session}
          >
            용돈이 더 필요해요
          </button>

          <button
            className={`w-fit rounded-xl border p-3 ${selectedType === 'QUESTION' || session?.chatType === 'QUESTION' ? 'border-yellow-300 bg-yellow-100' : 'border-gray-200 bg-white'}`}
            onClick={() => {
              setSelectedType('QUESTION');
            }}
            disabled={!!session}
          >
            무언가를 살지 말지 고민돼요
          </button>
        </div>
      </div>
    </div>
  );
}

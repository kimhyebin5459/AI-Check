import React from 'react';
import ProfileImage from '@/components/common/ProfileImage';

interface ChatBubbleProps {
  role: 'USER' | 'AI';
  content: string;
  aiImage?: string;
}

export default function ChatBubble({ role, content, aiImage = '/images/cuteRobotWithHeart.png' }: ChatBubbleProps) {
  return (
    <div className={`flex py-2 ${role === 'USER' ? 'justify-end' : 'justify-start'}`}>
      {role === 'AI' && (
        <div className="mr-2 flex-shrink-0">
          <ProfileImage image={aiImage} size="sm" />
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-xl p-3 ${
          role === 'USER'
            ? 'rounded-tr-none bg-yellow-300 text-white'
            : 'rounded-tl-none border border-gray-200 bg-white'
        }`}
      >
        <span className="break-words whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

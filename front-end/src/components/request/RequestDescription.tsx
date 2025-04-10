import React from 'react';

interface Props {
  text: string;
}

export default function RequestDescription({ text }: Props) {
  return (
    <div className="animate-subtle-bounce relative inline-block">
      {/* 말풍선 본체 */}
      <div className="relative rounded-xl bg-white px-6 py-3 shadow-md">
        <p className="text-center text-base font-light break-words">{text}</p>
      </div>

      {/* 말풍선 꼬리 (SVG) */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
          </filter>
          <path d="M0 0L10 10L20 0H0Z" fill="white" filter="url(#shadow)" />
        </svg>
      </div>

      {/* 커스텀 애니메이션을 위한 스타일 */}
      <style jsx>{`
        @keyframes subtleBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-subtle-bounce {
          animation: subtleBounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

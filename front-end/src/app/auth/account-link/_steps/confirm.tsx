"use client";

import Button from "@/components/common/Button";
import { useEffect } from "react";
import AccountCard from "@/components/auth/AccountCard";
import NoticePage from "@/components/common/NoticePage";

type AccountType = {
  id: string;
  accountNumber: string;
  bankName: string;
};

type Props = {
  account?: AccountType;
  onNext: () => void;
  onPrev: () => void;
};

export default function Confirm({ account, onNext, onPrev }: Props) {

  // 네이티브 뒤로가기 처리
  useEffect(() => {
    window.history.pushState({ page: 'confirm' }, '');

    const handlePopState = (event: Event) => {
      event.preventDefault();

      onPrev();

      window.history.pushState({ page: 'confirm' }, '');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onPrev]);

  if (!account) {
    return (
      <div>
        <NoticePage iconType="error" title="선택된 계좌 정보가 없습니다" message="잠시 후 다시 시도해보세요." buttonText='돌아가기' onButtonClick={()=>{onPrev()}} />
      </div>
    );
  }
  const handleSelectAccount = () => {};

  return (
    <div className="flex flex-col items-center flex-grow px-6">
      {/* Content container with centered alignment */}
      <div className="flex flex-col items-center justify-center w-full flex-1">
        <h1 className="text-mdl font-bold mb-10">선택하신 계좌가 맞나요?</h1>

        <div className="w-full">
          <AccountCard
            account={account}
            onSelect={handleSelectAccount}
            hasSelectButton={false}
          />
        </div>
      </div>

      <div className="w-full mt-auto grid grid-cols-2 gap-4 mb-10">
        <Button onClick={() => onPrev()} variant="secondary">다시 선택할게요</Button>
        <Button onClick={() => onNext()}>맞아요</Button>
      </div>
    </div>
  );
}
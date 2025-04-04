'use client';

import Modal from '../common/Modal';
import Button from '../common/Button';

import useChatStore from '@/app/stores/useChatStore';

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
  onGoToRequest: () => void;
}

export default function ResultModal({ isModalOpen, onClose, onGoToRequest }: Props) {
  const { session } = useChatStore();

  let title, content;

  switch (session?.chatType) {
    case 'PERSUADE':
      title = '엄마 AI 설득에 성공했어요!';
      content =
        '엄마에게 용돈 요청이 전달되었어요. 실제로 용돈을 받기까지는 시간이 걸리거나 거절될 수 있어요. 조금만 기다려주세요!';
      break;
    case 'QUESTION':
    default:
      title = '질문에 대한 응답이 종료되었어요.';
      content = '엄마와의 대화가 결정에 도움이 되었나요? 앞으로도 올바른 소비를 위해 노력해 보아요!';
      break;
  }

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} title={title}>
      <p>{content}</p>
      <div className="flex w-full gap-2 space-y-6">
        <Button onClick={onClose}>닫기</Button>
        <Button onClick={onGoToRequest}>보낸 요청 확인하기</Button>
      </div>
    </Modal>
  );
}

'use client';

import Modal from '../common/Modal';
import Button from '../common/Button';

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function CloseModal({ isModalOpen, onClose, onContinue }: Props) {
  const title = '대화를 그만둘까요?';
  const content = '여기서 나가면 지금까지의 대화 내용이 사라져요. 정말 나갈까요?';

  return (
    <Modal isOpen={isModalOpen} onClose={onContinue} title={title}>
      <p>{content}</p>
      <div className="flex gap-2">
        <Button onClick={onClose} variant="secondary">
          나가기
        </Button>
        <Button onClick={onContinue}>계속 설득하기</Button>
      </div>
    </Modal>
  );
}

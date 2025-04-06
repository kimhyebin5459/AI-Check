import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import ProfileImage from '@/components/common/ProfileImage';
import useDeleteRegularTransfer from '@/hooks/query/useDeleteRegularTransfer';

interface Props {
  scheduleId: number;
  name: string;
  image: string;
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function RegularTransferModal({ scheduleId, name, image, isModalOpen, closeModal }: Props) {
  const { mutate: deleteRegularTransfer } = useDeleteRegularTransfer();

  const handleClick = () => {
    deleteRegularTransfer(scheduleId);
    closeModal();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div className="flex flex-col items-center pt-2 text-xl font-bold">
        <ProfileImage image={image} size="md" />
        <p className="pt-2">{name} 에게 보내는</p>
        <p>정기 용돈을 취소할까요?</p>
      </div>
      <div className="flex w-full space-x-4">
        <Button variant="secondary" onClick={closeModal}>
          아니요
        </Button>
        <Button onClick={handleClick}>네</Button>
      </div>
    </Modal>
  );
}

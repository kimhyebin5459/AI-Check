'use client';

import { getAccountConfirm } from '@/apis/transfer';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import ChildAccountBadge from '@/components/transfer/ChildAccountBadge';
import useGetChildAccountList from '@/hooks/query/useGetChildAccountList';
import useInput from '@/hooks/useInput';
import useModal from '@/hooks/useModal';
import { ErrorTriangle } from '@/public/icons';
import { Transfer } from '@/types/transfer';
import Image from 'next/image';

type Props = {
  onNext: (account: Transfer) => void;
};

export default function Account({ onNext }: Props) {
  const { value, onChange, setValue } = useInput<string>('');
  const { data: childAccountList } = useGetChildAccountList();
  const { isModalOpen, openModal, closeModal } = useModal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 16) return;
    onChange(e);
  };

  const handleClick = async () => {
    try {
      const response = await getAccountConfirm(value);
      onNext({
        name: response.receiver.name,
        image: response.receiver.image,
        accountNo: value,
        amount: 0,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('찾을 수 없는 계좌입니다')) {
        openModal();
      }
    }
  };

  const setAccount = (account: string) => {
    setValue(account);
  };

  return (
    <>
      <div className="container space-y-5 px-5">
        <Header hasBackButton hasBorder={false} />
        <p className="text-mdl w-full pt-36 font-bold">누구에게 돈을 보낼까요?</p>
        <Input
          type="number"
          value={value}
          onChange={handleChange}
          label="계좌번호"
          placeholder="계좌번호를 입력하세요"
        />
        <div className="scrollbar-hide flex w-full space-x-2 overflow-x-auto pt-2">
          {childAccountList?.map((account) => (
            <ChildAccountBadge key={account.accountNo} {...account} setAccount={setAccount} />
          ))}
        </div>
        <div className="bottom-btn">
          <Button onClick={handleClick}>확인</Button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Image src={ErrorTriangle} alt="error icon" />
        <p className="font-semibold text-gray-800">존재하지 않는 계좌입니다.</p>
        <Button size="sm" onClick={closeModal}>
          닫기
        </Button>
      </Modal>
    </>
  );
}

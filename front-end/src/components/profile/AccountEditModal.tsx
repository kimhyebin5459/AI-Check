'use client';

import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { myAccountInfo } from '@/types/user';
import { myAccountList } from '@/mocks/fixtures/user';
import { useEffect, useState } from 'react';
import MyAccountItem from '@/components/profile/MyAccountItem';

interface Props {
  prevAccount: myAccountInfo;
  setEditAccount: (account: myAccountInfo) => void;
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function AccountEditModal({ prevAccount, setEditAccount, isModalOpen, closeModal }: Props) {
  const accountList = myAccountList;

  const [selectedAccount, setSelectedAccount] = useState<myAccountInfo>(prevAccount);

  useEffect(() => {}, [selectedAccount]);

  const handleClick = () => {
    setEditAccount(selectedAccount);
    closeModal();
  };

  return (
    <Modal position="bottom" isOpen={isModalOpen} onClose={closeModal} title="연동 계좌 변경">
      {accountList.map((account) => (
        <MyAccountItem
          key={account.id}
          setSelectedAccount={setSelectedAccount}
          account={account}
          isSelected={account.id === selectedAccount.id}
        />
      ))}
      <Button onClick={handleClick}>선택</Button>
    </Modal>
  );
}

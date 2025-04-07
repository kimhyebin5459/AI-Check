'use client';

import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useEffect, useState } from 'react';
import MyAccountItem from '@/components/profile/MyAccountItem';
import useGetMyAccountList from '@/hooks/query/useGetMyAccountList';
import { Account } from '@/types/account';

interface Props {
  prevAccount: Account;
  setEditAccount: (account: Account) => void;
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function AccountEditModal({ prevAccount, setEditAccount, isModalOpen, closeModal }: Props) {
  const { data: accountList } = useGetMyAccountList();

  const [selectedAccount, setSelectedAccount] = useState<Account>(prevAccount);

  useEffect(() => {
    if (prevAccount.accountId !== 0) {
      setSelectedAccount(prevAccount);
    }
  }, [prevAccount]);

  useEffect(() => {}, [selectedAccount]);

  const handleClick = () => {
    setEditAccount(selectedAccount);
    closeModal();
  };

  return (
    <Modal position="bottom" isOpen={isModalOpen} onClose={closeModal} title="연동 계좌 변경">
      {accountList?.map((account) => (
        <MyAccountItem
          key={account.accountId}
          setSelectedAccount={setSelectedAccount}
          account={account}
          isSelected={account.accountId === selectedAccount.accountId}
        />
      ))}
      <Button onClick={handleClick}>선택</Button>
    </Modal>
  );
}

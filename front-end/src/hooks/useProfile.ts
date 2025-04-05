import { Account } from '@/types/account';
import { MyAccountInfo } from '@/types/user';
import { useEffect, useState } from 'react';

export default function useProfile(image: string, account: MyAccountInfo) {
  const [profileImage, setProfileImage] = useState<string>(image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editAccount, setEditAccount] = useState<Account>({
    accountId: 0,
    accountName: '',
    accountNo: '',
  });

  useEffect(() => {
    if (account?.id) {
      setEditAccount({
        accountId: account.id,
        accountName: account.name,
        accountNo: account.no,
      });
    }
  }, [account]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setSelectedFile(file);
    }
  };

  return { profileImage, editAccount, setEditAccount, selectedFile, handleImageChange };
}

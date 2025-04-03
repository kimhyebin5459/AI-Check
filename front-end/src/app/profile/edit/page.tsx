'use client';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import ProfileImage from '@/components/common/ProfileImage';
import AccountEditModal from '@/components/profile/AccountEditModal';
import useModal from '@/hooks/useModal';
import { user } from '@/mocks/fixtures/user';
import { Arrow } from '@/public/icons';
import Plus from '@/public/icons/common/Plus';
import { myAccountInfo } from '@/types/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();

  const { name, birth, image, account } = user;

  const [profileImage, setProfileImage] = useState<string>(image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editAccount, setEditAccount] = useState<myAccountInfo>(account);
  const { isModalOpen, closeModal, openModal } = useModal();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleClick = () => {
    console.log(selectedFile, editAccount.id);
    router.push('/profile');
  };

  return (
    <>
      <div className="container px-5">
        <Header hasBackButton title="내 정보 수정" hasBorder={false} />
        <div className="relative space-y-3 pt-10 text-center">
          <ProfileImage image={profileImage} size="xl" />
          <label
            htmlFor="profile-upload"
            className="absolute -right-1 -bottom-2 cursor-pointer rounded-full border-3 border-white bg-yellow-400 p-1.5"
          >
            <Plus size={20} color="white" />
          </label>
          <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>
        <div className="w-full space-y-8 px-2 pt-16 text-xl">
          <div className="flex w-full items-center justify-between">
            <p className="text-gray-600">이름</p>
            <p>{name}</p>
          </div>
          <div className="flex w-full items-center justify-between">
            <p className="text-gray-600">생년월일</p>
            <p>{`${birth.slice(0, 4)}.${birth.slice(4, 6)}.${birth.slice(6)}`}</p>
          </div>
          <div className="flex w-full items-start justify-between">
            <p className="text-gray-600">연동 계좌</p>
            <div className="flex space-x-3" onClick={openModal}>
              <div className="text-right">
                <p>{editAccount.no}</p>
                <p className="-mt-1 text-sm">{editAccount.name}</p>
              </div>
              <Image src={Arrow} alt="arrow icon" className="mt-0.5 size-6 rotate-180" />
            </div>
          </div>
        </div>
        <div className="bottom-btn">
          <Button onClick={handleClick}>수정하기</Button>
        </div>
      </div>
      <AccountEditModal
        prevAccount={editAccount}
        setEditAccount={setEditAccount}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
      />
    </>
  );
}

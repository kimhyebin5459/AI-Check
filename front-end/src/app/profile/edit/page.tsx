'use client';

import ErrorComponent from '@/app/_components/error-component';
import LoadingComponent from '@/app/_components/loading-component';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import ProfileImage from '@/components/common/ProfileImage';
import AccountEditModal from '@/components/profile/AccountEditModal';
import useGetUserInfo from '@/hooks/query/useGetUserInfo';
import usePatchUserInfo from '@/hooks/query/usePatchUserInfo';
import usePostAccount from '@/hooks/query/usePostAccount';
import useModal from '@/hooks/useModal';
import useProfile from '@/hooks/useProfile';
import { Arrow } from '@/public/icons';
import Plus from '@/public/icons/common/Plus';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const { data: user, isPending, isError } = useGetUserInfo();
  const { mutate: updateUserInfo, isPending: isImagePending } = usePatchUserInfo();
  const { mutate: updateAccount } = usePostAccount();

  const { image = '', name = '', birth = '', account = { id: 0, name: '', no: '' } } = user || {};
  const { profileImage, editAccount, setEditAccount, selectedFile, handleImageChange, setProfileImage } = useProfile(
    image,
    account
  );

  const { isModalOpen, closeModal, openModal } = useModal();

  const handleClick = () => {
    if (selectedFile) {
      updateUserInfo(selectedFile);
    } else if (profileImage !== image && profileImage === '/images/defaultImage.png') {
      updateUserInfo(null);
    }
    updateAccount(editAccount.accountId);
    router.push('/profile');
  };

  const handleResetImage = () => {
    setProfileImage('/images/defaultImage.png');
  };

  if (isPending) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return (
    <>
      <div className="container px-5">
        <Header hasBackButton title="내 정보 수정" hasBorder={false} />
        <div className="relative space-y-3 pt-10 text-center">
          <ProfileImage image={profileImage} size="xl" />
          <div className="flex justify-center space-x-2">
            <label
              htmlFor="profile-upload"
              className="absolute -right-3 -bottom-0.5 cursor-pointer rounded-full border-3 border-white bg-yellow-400 p-1.5"
            >
              <Plus size={20} color="white" />
            </label>
            <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>
        <button onClick={handleResetImage} className="mt-3 text-sm text-gray-500 underline">
          기본 이미지 사용
        </button>
        <div className="w-full space-y-8 px-2 pt-16 text-xl">
          <div className="flex w-full items-center justify-between">
            <p className="text-gray-600">이름</p>
            <p>{name}</p>
          </div>
          <div className="flex w-full items-center justify-between">
            <p className="text-gray-600">생년월일</p>
            <p>{birth.replaceAll('-', '.')}</p>
          </div>
          <div className="flex w-full items-start justify-between">
            <p className="text-gray-600">연동 계좌</p>
            <div className="flex space-x-3" onClick={openModal}>
              <div className="text-right">
                <p>{editAccount.accountNo}</p>
                <p className="-mt-1 text-sm">{editAccount.accountName}</p>
              </div>
              <Image src={Arrow} alt="arrow icon" className="mt-0.5 size-6 rotate-180" />
            </div>
          </div>
        </div>
        <div className="bottom-btn">
          <Button onClick={handleClick}>{isImagePending ? '수정 중...' : '수정하기'}</Button>
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

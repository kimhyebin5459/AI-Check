import Button from '@/components/common/Button';
import Image from 'next/image';

import { Bank } from '@/public/icons';
import { Account } from '@/types/account';

type AccountCardProps = {
  account: Account;
  onSelect: (account: Account, e?: React.MouseEvent) => void;
  hasSelectButton?: boolean;
};

export default function AccountCard({ account, onSelect, hasSelectButton = true }: AccountCardProps) {
  const handleClick = () => {
    onSelect(account);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(account, e);
  };

  return (
    <div
      className="flex items-center justify-between rounded-xl border border-gray-400 p-4"
      onClick={hasSelectButton ? handleClick : undefined}
    >
      <div>
        <div className="mb-1 flex items-center text-xl text-gray-700">
          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-md bg-gray-200">
            <div className="h-6 w-6 items-center justify-center">
              <Image src={Bank} alt="은행" width={24} height={24} priority />
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600">{`${account.accountName} 계좌`}</div>
        <div className="text-base text-gray-600">{account.accountNo}</div>
      </div>
      {hasSelectButton && (
        <Button
          size="sm"
          isFullWidth={false}
          variant="secondary"
          className="h-10 rounded-lg"
          onClick={handleButtonClick}
        >
          선택
        </Button>
      )}
    </div>
  );
}

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
      className={`flex items-center justify-between rounded-xl p-4 ${hasSelectButton ? 'border border-gray-400' : 'shadow-outline'}`}
      onClick={hasSelectButton ? handleClick : undefined}
    >
      <div>
        <div className="flex items-center space-x-3 text-xl text-gray-700">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-200">
            <Image src={Bank} alt="은행" className="h-6 w-6 items-center justify-center" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{`${account.accountName}`}</p>
            <p className="text-base text-gray-600">{account.accountNo}</p>
          </div>
        </div>
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

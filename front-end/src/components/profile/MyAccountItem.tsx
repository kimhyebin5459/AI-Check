import { Bank } from '@/public/icons';
import Check from '@/public/icons/common/Check';
import { Account } from '@/types/account';
import Image from 'next/image';

interface Props {
  account: Account;
  isSelected?: boolean;
  setSelectedAccount: (account: Account) => void;
}

export default function MyAccountItem({ account, isSelected = false, setSelectedAccount }: Props) {
  const handleClick = () => {
    setSelectedAccount(account);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center space-x-3">
        <Image src={Bank} alt="은행" className="h-6 w-6 items-center justify-center" />
        <div className="space-y-1 text-gray-600">
          <p className="text-xl font-bold">{account.accountNo}</p>
          <p className="text-xs font-light">{account.accountName}</p>
        </div>
      </div>
      <div onClick={handleClick}>
        <Check isSelected={isSelected} />
      </div>
    </div>
  );
}

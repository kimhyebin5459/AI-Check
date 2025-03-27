import Button from '@/components/common/Button';
import Image from 'next/image';
import BankSrc from "/icons/common/bank.svg";

type AccountType = {
  id: string;
  accountNumber: string;
  bankName: string;
};

type AccountCardProps = {
  account: AccountType;
  onSelect: (account: AccountType, e?: React.MouseEvent) => void;
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
      className="p-4 border border-gray-400 rounded-xl flex justify-between items-center"
      onClick={hasSelectButton ? handleClick : undefined}
    >
      <div>
        <div className="flex items-center mb-1 text-gray-700 text-xl">
          <div className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center mr-2">
            <div className="h-6 w-6 items-center justify-center">
              <Image src={BankSrc} alt="은행" width={24} height={24} priority />
            </div>
          </div>
          <span>{account.bankName}</span>
        </div>
        <div className="text-gray-600 text-sm">{`${account.bankName} 계좌`}</div>
        <div className="text-gray-600 text-base">{account.accountNumber}</div>
      </div>
      {hasSelectButton && (
        <Button 
          size='sm' 
          fullWidth={false} 
          variant='secondary' 
          className='rounded-lg h-10' 
          onClick={handleButtonClick}
        >
          선택
        </Button>
      )}
    </div>
  );
}
'use client';

import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import ChildAccountBadge from '@/components/transfer/ChildAccountBadge';
import useInput from '@/hooks/useInput';
import { accountResponse } from '@/mocks/fixtures/account';
import { Transfer } from '@/types/transfer';

type Props = {
  onNext: (account: Transfer) => void;
};

export default function Account({ onNext }: Props) {
  const { value, onChange, setValue } = useInput<string>('');
  const childAccountList = accountResponse.accounts;

  const handleClick = () => {
    // value로 계좌번호 조회 -> 있으면 onNext(계좌 정보로 초기화)
    onNext({
      name: childAccountList[0].name,
      image: childAccountList[0].image,
      accountNo: value,
      amount: 0,
    });
  };

  const setAccount = (account: string) => {
    setValue(account);
  };

  return (
    <div className="container space-y-5 px-5">
      <Header hasBackButton hasBorder={false} />
      <p className="text-mdl w-full pt-36 font-bold">누구에게 돈을 보낼까요?</p>
      <Input type="number" value={value} onChange={onChange} label="계좌번호" placeholder="계좌번호를 입력하세요" />
      <div className="scrollbar-hide flex w-full space-x-2 overflow-x-auto pt-2">
        {childAccountList.map((account) => (
          <ChildAccountBadge key={account.accountNo} {...account} setAccount={setAccount} />
        ))}
      </div>
      <div className="bottom-btn">
        <Button onClick={handleClick}>확인</Button>
      </div>
    </div>
  );
}

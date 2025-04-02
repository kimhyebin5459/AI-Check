import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import ChildAccountCard from '@/components/transfer/ChildAccountCard';
import { accountList } from '@/mocks/fixtures/account';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="container justify-center">
      <Header hasBackButton hasBorder={false} />
      <div className="w-full space-y-10 overflow-y-auto px-5 pb-[5.5rem]">
        <div className="text-mdl flex w-full flex-col justify-start font-bold">
          <p>자녀들을</p>
          <p>한 눈에 관리해요</p>
        </div>
        <div className="w-full space-y-4">
          {accountList.map((account) => (
            <ChildAccountCard key={account.accountNo} {...account} />
          ))}
        </div>
        <div className="flex w-full gap-4">
          <Link href="mother-ai/list" className="w-full">
            <Button variant="secondary" size="lg">
              엄마 AI 설정
            </Button>
          </Link>
          <Link href="/regular-transfer" className="w-full">
            <Button size="lg">정기 송금 관리</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

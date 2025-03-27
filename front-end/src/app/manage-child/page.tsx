import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import RegularTransferCard from '@/components/regular-transfer/RegularTransferCard';
import { accountList } from '@/mocks/fixtures/account';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="container">
      <Header hasBackButton hasBorder={false} />
      <div className="w-full space-y-10 overflow-y-auto px-5 pb-[5.5rem]">
        <div className="text-mdl flex w-full flex-col justify-start font-bold">
          <p>자녀들을</p>
          <p>한 눈에 관리해요</p>
        </div>
        <div className="w-full space-y-4">
          {accountList.map((account) => (
            <RegularTransferCard key={account.accountNo} {...account} />
          ))}
        </div>
        <div className="grid w-full grid-cols-2">
          <div className="col-span-1">
            <Link href="/regular-transfer">
              <Button>정기 송금 관리</Button>
            </Link>
          </div>
          <div className="col-span-1 flex justify-end">
            <Link href="/auth/signup">
              <div className="grid size-16 place-items-center rounded-full bg-yellow-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M36 25.9961H26V35.9961C26 36.5265 25.7893 37.0352 25.4142 37.4103C25.0391 37.7854 24.5304 37.9961 24 37.9961C23.4696 37.9961 22.9609 37.7854 22.5858 37.4103C22.2107 37.0352 22 36.5265 22 35.9961V25.9961H12C11.4696 25.9961 10.9609 25.7854 10.5858 25.4103C10.2107 25.0352 10 24.5265 10 23.9961C10 23.4657 10.2107 22.957 10.5858 22.5819C10.9609 22.2068 11.4696 21.9961 12 21.9961H22V11.9961C22 11.4657 22.2107 10.957 22.5858 10.5819C22.9609 10.2068 23.4696 9.99609 24 9.99609C24.5304 9.99609 25.0391 10.2068 25.4142 10.5819C25.7893 10.957 26 11.4657 26 11.9961V21.9961H36C36.5304 21.9961 37.0391 22.2068 37.4142 22.5819C37.7893 22.957 38 23.4657 38 23.9961C38 24.5265 37.7893 25.0352 37.4142 25.4103C37.0391 25.7854 36.5304 25.9961 36 25.9961Z"
                    fill="white"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

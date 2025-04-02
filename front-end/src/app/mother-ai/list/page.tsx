import React from 'react';
import Header from '@/components/common/Header';
import ChildList from '@/components/mother-ai/ChildList';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="bg-gradation1 container">
      <Header title="엄마 AI" hasBackButton hasBorder={false} />
      <main className="flex h-full w-full flex-col justify-end">
        <div className="flex items-end justify-between px-5">
          <h1 className="pb-7 text-2xl font-bold whitespace-nowrap">
            자녀마다
            <br />
            AI의 설정을 변경해요
          </h1>
          <div className="flex w-full justify-center">
            <Image src="/images/cuteRobotWithHeart.png" alt="로봇 이미지" width={90} height={177}></Image>
          </div>
        </div>

        <ChildList />
      </main>
    </div>
  );
}

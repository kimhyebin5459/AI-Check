import React from 'react';
import Header from '@/components/common/Header';
import ChildList from '@/components/mother-ai/ChildList';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="bg-gradation1 container h-full w-full">
      <Header title="엄마 AI" hasBackButton />
      <main className="flex h-full w-full flex-col justify-end">
        <div className="flex items-end">
          <h1 className="text-mdl pr-3 pb-7 pl-5 font-bold">
            자녀마다
            <br />
            AI의 설정을 변경해요
          </h1>
          <Image src="/images/cuteRobotWithHeart.png" alt="로봇 이미지" width={114} height={230}></Image>
        </div>

        <ChildList />
      </main>
    </div>
  );
}

import React from 'react';
import Header from '@/components/common/Header';
import Section from '@/components/phishing/Section';
import GuideItem from '@/components/phishing/GuideItem';
import AlertBanner from '@/components/phishing/AlertBanner';
import EmergencyContact from '@/components/phishing/EmergencyContact';
import { phishingData, lastUpdated } from '@/constants/protect';

export default function Page() {
  return (
    <div className="h-full bg-yellow-50 pb-6">
      <div className="container">
        <Header title="가족을 지키는 보이스피싱 예방 수칙" hasBackButton />

        <main className="scrollbar-hide w-full overflow-y-auto px-5 pt-5">
          <AlertBanner message="보이스피싱과 스미싱은 지능적으로 진화하고 있습니다. 가족 전체가 이 수칙을 함께 숙지하세요." />

          {phishingData.map((section) => (
            <Section key={section.id} id={section.id} title={section.title} icon={section.icon}>
              {section.items.map((item, index) => (
                <GuideItem key={`${section.id}-item-${index}`} title={item.title} details={item.details} />
              ))}
            </Section>
          ))}

          <EmergencyContact />

          <div className="mb-6 text-center text-xs text-gray-500">마지막 업데이트: {lastUpdated}</div>
        </main>
      </div>
    </div>
  );
}

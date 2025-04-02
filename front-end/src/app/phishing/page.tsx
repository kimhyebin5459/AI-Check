import Header from '@/components/common/Header';
import PhishingContent from '@/components/phishing/PhishingContent';

export default function Page() {
  return (
    <div className="container flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header hasBackButton hasBorder={false} title="우리 가족 피싱 위험" />
      <main className="flex w-full flex-1 flex-col gap-4 p-5 pb-[6.5rem]">
        <PhishingContent />
      </main>
    </div>
  );
}

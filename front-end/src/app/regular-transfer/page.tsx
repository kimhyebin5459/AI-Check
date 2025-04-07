import Header from '@/components/common/Header';
import RegularTransferSection from '@/components/regular-transfer/RegularTransferSection';

export default function Page() {
  return (
    <div className="container">
      <Header hasBackButton title="자녀 정기 용돈" backPath="/manage-child" />
      <RegularTransferSection />
    </div>
  );
}

import Header from '@/components/common/Header';
import ProfileSection from '@/components/profile/ProfileSection';

export default async function Page() {
  return (
    <div className="container space-y-7 bg-gradation2 px-5">
      <Header hasBackButton title="내 정보" hasBorder={false} backPath="/" />
      <ProfileSection />
    </div>
  );
}

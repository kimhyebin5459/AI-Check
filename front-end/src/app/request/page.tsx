import Header from '@/components/common/Header';
import RequestCard from '@/components/request/RequestCard';
import { requestList as data } from '@/mocks/fixtures/request';
import { UserType } from '@/types/user';

export default function Page() {
  const role: UserType = 'PARENT';
  const requestList = data;

  return (
    <div className="container bg-gray-50">
      <Header hasBackButton hasBorder={false} title="용돈 요청 내역" />
      <div className="w-full space-y-2 overflow-y-auto p-5">
        {requestList.map((req) => (
          <RequestCard key={req.id + req.type} request={req} isParent={role === 'PARENT' ? true : false} />
        ))}
      </div>
    </div>
  );
}

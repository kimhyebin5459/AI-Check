import Button from '@/components/common/Button';
import useGetCheckIsRegistered from '@/hooks/query/useGetCheckIsRegistered';
import { useRouter } from 'next/navigation';

interface Props {
  reportId: string;
  childId: number;
}

export default function IncreaseButton({ reportId, childId }: Props) {
  const router = useRouter();

  const { data: isRegistered } = useGetCheckIsRegistered(reportId);

  const handleClick = () => {
    router.push(`/request/send?reportId=${reportId}&childId=${childId}`);
  };

  return (
    <>
      {!isRegistered && (
        <div className="w-full pt-5 pb-10">
          <Button onClick={handleClick}>용돈 인상 요청 보내기</Button>
        </div>
      )}
    </>
  );
}

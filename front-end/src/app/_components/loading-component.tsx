import Spinner from '@/components/common/Spinner';

interface Props {
  isInner?: boolean;
}

export default function LoadingComponent({ isInner = false }: Props) {
  return (
    <div className={`flex items-center justify-center ${isInner ? 'h-full' : 'min-h-dvh'}`}>
      <Spinner />
    </div>
  );
}

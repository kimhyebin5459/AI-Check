import NoticePage from '@/components/common/NoticePage';
import { useRouter } from 'next/navigation';

interface Props {
  title?: string;
  message?: string;
  subMessage?: string;
  buttonText?: string;
  iconType?: 'success' | 'error';
  onButtonClick?: () => void;
}

export default function ErrorComponent({
  title = '앗!',
  message = '무엇인가 잘못되었어요. 다시 시도해보세요.',
  subMessage,
  buttonText = '돌아가기',
  iconType = 'error',
  onButtonClick,
}: Props) {
  const router = useRouter();

  const handleButtonClick =
    onButtonClick ||
    (() => {
      router.back();
    });

  return (
    <NoticePage
      buttonText={buttonText}
      onButtonClick={handleButtonClick}
      title={title}
      message={message}
      subMessage={subMessage}
      iconType={iconType}
    />
  );
}

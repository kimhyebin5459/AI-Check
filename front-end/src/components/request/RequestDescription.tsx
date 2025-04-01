import { SpeechBubble } from '@/public/icons';
import Image from 'next/image';

interface Props {
  text: string;
}

export default function RequestDescription({ text }: Props) {
  return (
    <div className="relative inline-block animate-bounce">
      <Image src={SpeechBubble} alt="speech icon" />
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform pb-4 text-center text-base font-light whitespace-nowrap">
        {text}
      </p>
    </div>
  );
}

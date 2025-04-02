import { Arrow } from '@/public/icons';
import Image from 'next/image';

interface Props {
  text: string;
  onClick: () => void;
}

export default function ArrowButton({ text, onClick }: Props) {
  return (
    <div
      className="mt-5 flex h-14 w-full items-center justify-end space-x-2 rounded-xl bg-white px-4"
      onClick={onClick}
    >
      <p className="text-xl font-bold">{text}</p>
      <Image src={Arrow} alt="arrow icon" className="size-7 rotate-180" />
    </div>
  );
}

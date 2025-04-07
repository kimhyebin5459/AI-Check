import { Spin } from '@/public/icons';
import Image from 'next/image';

interface Props {
  size?: 'sm' | 'md';
}

export default function Spinner({ size = 'sm' }: Props) {
  return <Image src={Spin} alt="spin icon" className={`animate-spin ${size === 'sm' ? 'size-12' : 'size-20'}`} />;
}

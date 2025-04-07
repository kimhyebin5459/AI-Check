import Bus from '@/public/icons/category/Bus';
import Enjoy from '@/public/icons/category/Enjoy';
import Living from '@/public/icons/category/Living';
import Study from '@/public/icons/category/Study';
import Tableware from '@/public/icons/category/Tableware';
import { CategoryName } from '@/types/report';

interface Props {
  icon: CategoryName;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export default function CategoryIcon({ icon, color, size, strokeWidth }: Props) {
  return (
    <>
      {icon === '교통' && <Bus color={color} size={size} strokeWidth={strokeWidth} />}
      {icon === '식비' && <Tableware color={color} size={size} strokeWidth={strokeWidth} />}
      {icon === '교육' && <Study color={color} size={size} strokeWidth={strokeWidth} />}
      {icon === '여가' && <Enjoy color={color} size={size} strokeWidth={strokeWidth} />}
      {icon === '생활' && <Living color={color} size={size} strokeWidth={strokeWidth} />}
    </>
  );
}

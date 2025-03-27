import Image from 'next/image';

interface Props {
  icon: string;
  label: string;
  isActive?: boolean;
}

export default function FooterItem({ icon, label, isActive }: Props) {
  return (
    <div className="flex w-11 flex-col items-center space-y-1">
      <Image src={icon} alt={`${label} icon`} />
      <p className={`text-xs font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
    </div>
  );
}

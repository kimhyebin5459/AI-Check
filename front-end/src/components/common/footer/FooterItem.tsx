import Image from 'next/image';

interface Props {
  icon: string;
  label: string;
  isActive?: boolean;
  notificationCount?: number;
}

export default function FooterItem({ icon, label, isActive, notificationCount = 0 }: Props) {
  return (
    <div className="relative flex w-11 flex-col items-center space-y-1">
      <div className="relative">
        <Image src={icon} alt={`${label} icon`} />
        {notificationCount > 0 && (
          <div className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-400 px-1 text-xs font-thin text-white shadow-sm backdrop-blur-sm">
            {notificationCount}
          </div>
        )}
      </div>
      <p className={`text-xs font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
    </div>
  );
}

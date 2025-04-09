import Image from 'next/image';

interface Props {
  image?: string | null;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeToPixels = {
  xs: 28,
  sm: 40,
  md: 60,
  lg: 72,
  xl: 100,
};

export default function ProfileImage({ image, size }: Props) {
  const defaultImage = '/images/defaultImage.png';

  return (
    <div
      className="overflow-hidden rounded-full border-[0.06rem] border-gray-600"
      style={{ width: sizeToPixels[size], height: sizeToPixels[size], position: 'relative' }}
    >
      <Image
        src={image || defaultImage}
        alt="my profile image"
        className="object-cover"
        unoptimized={true}
        priority
        fill
      />
    </div>
  );
}

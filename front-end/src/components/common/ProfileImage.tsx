import Image from 'next/image';

interface Props {
  image: string;
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
  const defaultImage = '/images/defaultImage.jpg';

  return (
    <div
      className="overflow-hidden rounded-full border-[0.06rem] border-gray-600"
      style={{ width: sizeToPixels[size], height: sizeToPixels[size] }}
    >
      <Image
        src={image || defaultImage}
        alt="my profile image"
        width={sizeToPixels[size]}
        height={sizeToPixels[size]}
        className="object-cover"
        unoptimized={true}
      />
    </div>
  );
}

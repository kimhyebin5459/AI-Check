import clsx from 'clsx';

import Image from 'next/image';

interface Props {
  image: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeToPixels = {
  'sm': 40,
  'md': 52,
  'lg': 72,
  'xl': 100
};

export default function ProfileImage({ image, size }: Props) {
  return (
    <div>
      <Image
        src={image}
        alt="my profile image"
        width={sizeToPixels[size]}
        height={sizeToPixels[size]}
        className={clsx(`rounded-full border-[0.06rem] border-gray-600 object-cover`)}
      />
    </div>
  );
}

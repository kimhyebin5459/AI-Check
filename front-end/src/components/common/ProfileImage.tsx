import clsx from 'clsx';

interface Props {
  image: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
}

export default function ProfileImage({ image, size }: Props) {
  return (
    <div>
      <img
        src={image}
        alt="my profile image"
        className={clsx(`rounded-full border-[0.06rem] border-gray-600 object-cover`, {
          'size-10': size === 'sm',
          'size-13': size === 'md',
          'size-18': size === 'lg',
          'size-25': size === 'xl',
        })}
      />
    </div>
  );
}

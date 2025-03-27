import ProfileImage from '../common/ProfileImage';

interface Props {
  image: string;
  name: string;
}

export default function UserItem({ image, name }: Props) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <ProfileImage image={image} size="md" />
      <p className="font-bold">{name}</p>
    </div>
  );
}

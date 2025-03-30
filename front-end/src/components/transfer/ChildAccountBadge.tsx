import ProfileImage from '../common/ProfileImage';

interface Props {
  image: string;
  name: string;
  accountNo: string;
  setAccount: (account: string) => void;
}

export default function ChildAccountBadge({ image, name, accountNo, setAccount }: Props) {
  return (
    <div
      className="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-2"
      onClick={() => setAccount(accountNo)}
    >
      <ProfileImage image={image} size="xs" />
      <p className="font-bold whitespace-nowrap text-gray-700">{name}</p>
    </div>
  );
}

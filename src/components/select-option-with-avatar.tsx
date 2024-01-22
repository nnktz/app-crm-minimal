import CustomAvatar from './custom-avatar';
import { Text } from './text';

type SelectOptionWithAvatarProps = {
  name: string;
  avatarUrl?: string;
  shape?: 'circle' | 'square';
};

const SelectOptionWithAvatar = ({
  name,
  avatarUrl,
  shape,
}: SelectOptionWithAvatarProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <CustomAvatar
        shape={shape}
        name={name}
        src={avatarUrl}
      />
      <Text>{name}</Text>
    </div>
  );
};

export default SelectOptionWithAvatar;

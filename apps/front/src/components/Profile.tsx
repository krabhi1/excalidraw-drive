import { Space, Avatar, Typography } from "antd";
import { UserProfile } from "../interfaces";
const { Text } = Typography;
export default function Profile({profile}:{profile:UserProfile}) {
  return (
    <Space size={8}>
      <Avatar
        size={32}
        src={
          profile.imageURL
        }
      />
      <Text>{profile.name}</Text>
    </Space>
  );
}

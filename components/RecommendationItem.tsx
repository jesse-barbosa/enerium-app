import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  text: string;
};

export default function RecommendationItem({ text }: Props) {
  return (
    <View className="flex flex-row items-center mb-2">
      <MaterialIcons name="lightbulb-outline" size={20} color="#4caf50" />
      <Text className="ml-2 text-lg text-neutral-700">{text}</Text>
    </View>
  );
}
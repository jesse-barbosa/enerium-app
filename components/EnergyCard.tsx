import { View, Text } from 'react-native';

type Props = {
  title: string;
  value: string;
};

export default function EnergyCard({ title, value }: Props) {
  return (
    <View className="bg-white border border-neutral-200 shadow-md rounded-lg p-6 mb-4">
        <Text className="text-md text-neutral-700">{title}</Text>
        <Text className="text-lg font-bold text-neutral-900">{value}</Text>
    </View>
  );
}
import { View, Text } from 'react-native';
import { Zap, Bell } from 'lucide-react-native';

export default function Header() {
  return (
    <View className="flex flex-row items-center justify-between p-4 bg-primary">
        <Zap className="text-white" size={24} />
        <Text className="text-2xl font-bold text-white">Enerium</Text>
        <Text className="text-2xl font-bold text-white">Olá, Jessé!</Text>
        <Bell className="text-white" size={24} />
    </View>
  );
}
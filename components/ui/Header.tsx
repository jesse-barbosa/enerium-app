import { View, Text } from 'react-native';
import { Zap, Bell } from 'lucide-react-native';

export default function Header() {
  return (
    <View className="flex flex-row items-center justify-between px-4 py-6 bg-primary">
        <Zap color="#fff" className="font-bold" size={30} />
        <Text className="text-2xl font-bold text-white">Olá, Jessé!</Text>
        <Bell color="#fff" className="font-bold" size={30} />
    </View>
  );
}
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import EnergyCard from '../components/EnergyCard';
import BarChart from '../components/BarChart';
import RecommendationItem from '../components/RecommendationItem';
import Header from '../components/ui/Header';

export default function DashboardScreen() {
  return (
    <View>
      <Header />
      <ScrollView className="p-4">
        <View className="mt-4">
          <EnergyCard title="Consumo Atual" value="342 kWh" />
          <EnergyCard title="Média Mensal" value="298 kWh" />
        </View>

        <View className="mt-4">
          <Text className="text-xl m-3">Gráfico de Consumo</Text>
          <BarChart />
        </View>

        <View className="mt-4">
          <Text className="text-xl m-3">Recomendações</Text>
          <RecommendationItem text="Desligue aparelhos em stand-by." />
          <RecommendationItem text="Use iluminação natural quando possível." />
        </View>
      </ScrollView>
    </View>
  );
}
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import EnergyCard from '../components/EnergyCard';
import BarChart from '../components/BarChart';
import RecommendationItem from '../components/RecommendationItem';
import Header from '../components/ui/Header';

export default function DashboardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <View style={styles.section}>
        <EnergyCard title="Consumo Atual" value="342 kWh" />
        <EnergyCard title="Média Mensal" value="298 kWh" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gráfico de Consumo</Text>
        <BarChart />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recomendações</Text>
        <RecommendationItem text="Desligue aparelhos em stand-by." />
        <RecommendationItem text="Use iluminação natural quando possível." />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { marginLeft: 12 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});
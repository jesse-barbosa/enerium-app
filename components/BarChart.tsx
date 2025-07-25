import { Dimensions } from 'react-native';
import { BarChart as Chart } from 'react-native-chart-kit';

export default function BarChart() {
  return (
    <Chart
      data={{
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
        datasets: [{ data: [50, 40, 70, 30, 85, 65, 45] }],
      }}
      width={Dimensions.get('window').width - 32}
      height={220}
      fromZero
      showValuesOnTopOfBars
      chartConfig={{
        backgroundColor: '#fff',
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(34, 94, 140, ${opacity})`,
        labelColor: () => '#444',
        style: { borderRadius: 16 },
      }}
      style={{ borderRadius: 16 }}
    />
  );
}
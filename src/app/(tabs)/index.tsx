import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';

import { AppHeader } from '../../components/layout/AppHeader';

export default function Dashboard() {
  const [stats, setStats] = useState({
    environments: 0,
    equipments: 0,
    totalKwh: 0,
    totalCost: 0,
  });

  const { user } = useAuth();

  const userName = user?.user_metadata?.name;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: environments } = await supabase.from('environments').select('*');
    const { data: equipments } = await supabase.from('equipments').select('*');

    let totalKwh = 0;
    equipments?.forEach(eq => {
      totalKwh +=
        (eq.power_watts * eq.hours_per_day * eq.days_per_month * eq.quantity) /
        1000;
    });

    const tariff = environments?.[0]?.energy_tariff || 0;

    setStats({
      environments: environments?.length || 0,
      equipments: equipments?.length || 0,
      totalKwh,
      totalCost: totalKwh * tariff,
    });
  };

  return (
    <View style={styles.container}>

      <AppHeader 
        title={`Olá, ${userName}!`}
      />

      <View style={styles.summary}>
        {/* Cards principais */}
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Consumo mensal</Text>
            <Text style={styles.cardValue}>{stats.totalKwh.toFixed(1)} kWh</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Custo estimado</Text>
            <Text style={styles.cardValue}>R$ {stats.totalCost.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>Ambientes</Text>
            <Text style={styles.cardValue}>{stats.environments}</Text>
          </View>

          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>Equipamentos</Text>
            <Text style={styles.cardValue}>{stats.equipments}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summary: {
    padding: 24,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  cardSmall: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 1,
  },
  cardLabel: {
    fontSize: 13,
    color: '#777',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginTop: 6,
  },
});
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SwipeableEquipmentCard } from '../../components/equipments/SwipeableEquipmentCard';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';

const ENERGY_PRICE = 0.95;

export default function EnvironmentDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [environment, setEnvironment] = useState<any>(null);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: env } = await supabase
      .from('environments')
      .select('*')
      .eq('id', id)
      .single();

    const { data: eq } = await supabase
      .from('equipments')
      .select('*')
      .eq('environment_id', id);

    setEnvironment(env);
    setEquipments(eq || []);
    setLoading(false);
  }

  async function deleteEquipment(equipmentId: string) {
    await supabase
        .from('equipments')
        .delete()
        .eq('id', equipmentId);

    setEquipments(prev =>
        prev.filter(item => item.id !== equipmentId)
    );
  }

  function calculateTotalConsumption() {
    return equipments.reduce((total, item) => {
      const monthly =
        (item.power_watts * item.hours_per_day * item.days_per_month) / 1000;
      return total + monthly;
    }, 0);
  }

  const totalConsumption = calculateTotalConsumption();
  const totalCost = totalConsumption * ENERGY_PRICE;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.title}>{environment?.name}</Text>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#777" />
        </TouchableOpacity>
      </View>

      {/* RESUMO */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="flash" size={20} color={colors.primary} />
          <Text style={styles.summaryValue}>
            {totalConsumption.toFixed(2)} kWh
          </Text>
          <Text style={styles.summaryLabel}>Consumo Mensal</Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons name="cash-outline" size={20} color={colors.secondary} />
          <Text style={styles.summaryValue}>
            R$ {totalCost.toFixed(2)}
          </Text>
          <Text style={styles.summaryLabel}>Custo Estimado</Text>
        </View>
      </View>

      {/* EQUIPAMENTOS */}
      <Text style={styles.sectionTitle}>Equipamentos</Text>

      <FlatList
        data={equipments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
        <SwipeableEquipmentCard
            item={item}
            onEdit={() =>
            router.push(`/equipment-edit/${item.id}`)
            }
            onDelete={() =>
            deleteEquipment(item.id)
            }
        />
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(`/equipment-create/${id}`)}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 6,
    alignItems: 'center',
    elevation: 3,
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
    color: colors.text,
  },

  summaryLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: colors.text,
  },

  equipmentCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  equipmentName: {
    fontWeight: '700',
    fontSize: 14,
    color: colors.text,
  },

  equipmentMeta: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
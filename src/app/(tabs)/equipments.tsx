import { Ionicons } from '@expo/vector-icons';

import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';

import { EmptyState } from '../../components/equipments/EmptyState';
import { AppHeader } from '../../components/layout/AppHeader';

export default function Equipments() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('equipments').select('*').then(({ data }) => {
      setData(data || []);
    });
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Equipamentos"
      />

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 120,
        }}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.power_watts}W • {item.hours_per_day}h/dia</Text>
          </View>
        )}
      />

      {/* BOTÃO FLUTUANTE */}
      <Link href="" asChild>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  card: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8
  },
  name: {
    fontWeight: 'bold'
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 92,
    width: 46,
    height: 46,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
import { Ionicons } from '@expo/vector-icons';

import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '../../components/environments/EmptyState';
import { EnvironmentCard } from '../../components/environments/EnvironmentCard';
import { AppHeader } from '../../components/layout/AppHeader';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';

export default function Environments() {
  const router = useRouter();

  const mockData = [
    {
      id: 1,
      name: 'Ambiente 1',
      type: 'Residencial',
      area_m2: 100,
    },
    {
      id: 2,
      name: 'Ambiente 2',
      type: 'Comercial',
      area_m2: 200,
    },
    {
      id: 3,
      name: 'Ambiente 3',
      type: 'Industrial',
      area_m2: 300,
    },
    {
      id: 4,
      name: 'Ambiente 4',
      type: 'Residencial',
      area_m2: 100,
    },
    {
      id: 5,
      name: 'Ambiente 5',
      type: 'Comercial',
      area_m2: 200,
    },
    {
      id: 6,
      name: 'Ambiente 6',
      type: 'Industrial',
      area_m2: 300,
    },
  ]

  const [environments, setEnvironments] = useState<any[]>([]);

  useEffect(() => {
    loadEnvironments();
  }, []);

  async function loadEnvironments() {

    // mock
    // setEnvironments(mockData);
    // return;

    const { data } = await supabase
      .from('environments')
      .select('*')
      .order('created_at', { ascending: false });

    setEnvironments(data || []);

  }

  return (
    <View style={styles.container}>

      <AppHeader 
        title="Ambientes"
      />


      {/* LISTA */}
      <FlatList
        data={environments}
        style={styles.list}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 120,
        }}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <EnvironmentCard
            name={item.name}
            type={item.type}
            area={item.area_m2}
            onPress={() => {}}
          />
        )}
      />

      {/* BOTÃO FLUTUANTE */}
      <Link href="/environment-create" asChild>
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
  list: {
    flex: 1,
    padding: 16,
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
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '../../components/environments/EmptyState';
import { SwipeableEnvironmentCard } from '../../components/environments/SwipeableEnvironmentCard';
import { AppHeader } from '../../components/layout/AppHeader';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';

export default function Environments() {
  const router = useRouter();
  const [myEnvironments, setMyEnvironments] = useState<any[]>([]);
  const [sharedEnvironments, setSharedEnvironments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'mine' | 'shared'>('mine');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnvironments();
  }, []);

  async function loadEnvironments() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) return;

    try {
    // Meus ambientes
    const { data: mine, error: mineError } = await supabase
      .from('environments')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (mineError) {
      console.error("Erro ao carregar ambientes: ", mineError);
      setLoading(false);
      return;
    }

    // Compartilhados comigo
    const { data: shared, error: sharedError } = await supabase
      .from('environment_members')
      .select(`
        environment:environments (*)
      `)
      .eq('user_id', userId);

    if (sharedError) {
      console.error("Erro ao carregar ambientes: ", sharedError);
      setLoading(false);
      return;
    }
    
    setMyEnvironments(mine || []);
    setSharedEnvironments(shared?.map((item: any) => item.environment) || []);
    setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const dataToRender = activeTab === 'mine' ? myEnvironments : sharedEnvironments;

  return (
    <View style={styles.container}>
      <AppHeader title="Ambientes" />

      {/* RESUMO */}
      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{myEnvironments.length}</Text>
          <Text style={styles.summaryLabel}>Meus</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{sharedEnvironments.length}</Text>
          <Text style={styles.summaryLabel}>Compartilhados</Text>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mine' && styles.activeTab]}
          onPress={() => setActiveTab('mine')}
        >
          <Text style={activeTab === 'mine' ? styles.activeText : styles.inactiveText}>
            Meus Ambientes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'shared' && styles.activeTab]}
          onPress={() => setActiveTab('shared')}
        >
          <Text style={activeTab === 'shared' ? styles.activeText : styles.inactiveText}>
            Compartilhados
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        data={dataToRender}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading ? <EmptyState /> : null}
        renderItem={({ item }) => (
          <SwipeableEnvironmentCard
            item={item}
            onPress={() => router.push(`/environment/${item.id}`)}
            onEdit={() => router.push(`/environment-edit/${item.id}`)}
            onDelete={async () => {
              await supabase.from('environments').delete().eq('id', item.id);
              loadEnvironments();
            }}
          />
        )}
      />

      {/* FAB */}
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

  /* SUMMARY */
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  summaryNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },

  summaryLabel: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },

  /* TABS */
  tabs: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#F2F4F7',
    borderRadius: 14,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#fff',
    elevation: 2,
  },

  activeText: {
    fontWeight: '700',
    color: colors.primary,
  },

  inactiveText: {
    color: '#777',
    fontWeight: '600',
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
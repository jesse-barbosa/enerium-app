import { Feather } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { AppHeader } from '../../components/layout/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Stats {
  environments: number;
  equipments: number;
  totalKwh: number;
  totalCost: number;
  efficiency: number;
  savingsPotential: number;
}

// ─── Componentes ──────────────────────────────────────────────────────────────

function ProgressBar({ percent }: { percent: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: percent, duration: 1200, useNativeDriver: false }).start();
  }, [percent]);
  const w = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  const color = percent > 75 ? '#E05252' : percent > 40 ? '#E8A030' : '#2ECC8F';
  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { width: w, backgroundColor: color }]} />
    </View>
  );
}

function MetricRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricIcon}>
        <Feather name={icon} size={15} color={colors.primary} />
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricRight}>
        <Text style={styles.metricValue}>{value}</Text>
        {sub && <Text style={styles.metricSub}>{sub}</Text>}
      </View>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    environments: 0,
    equipments: 0,
    totalKwh: 0,
    totalCost: 0,
    efficiency: 0,
    savingsPotential: 0,
  });

  const { user } = useAuth();
  const userName = user?.user_metadata?.name?.split(' ')[0] ?? 'Usuário';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    loadStats();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadStats = async () => {
    const { data: environments } = await supabase.from('environments').select('*');
    const { data: equipments } = await supabase.from('equipments').select('*');
    let totalKwh = 0;
    equipments?.forEach(eq => {
      totalKwh += (eq.power_watts * eq.hours_per_day * eq.days_per_month * eq.quantity) / 1000;
    });
    const tariff = environments?.[0]?.energy_tariff || 0;
    const totalCost = totalKwh * tariff;
    const efficiency =
      totalKwh > 0 ? Math.min(100, Math.round((1 - totalCost / (totalKwh * 1.5)) * 100)) : 0;
    setStats({
      environments: environments?.length || 0,
      equipments: equipments?.length || 0,
      totalKwh,
      totalCost,
      efficiency,
      savingsPotential: totalCost * 0.18,
    });
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const WEEK_DAYS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const WEEK_H = [65, 80, 55, 90, 72, 45, 38];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <View style={styles.container}>
      <AppHeader title="Dashboard" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Cabeçalho ─────────────────────────────────────── */}

          {/* ── Consumo principal ─────────────────────────────── */}
          <View style={styles.heroSection}>
            <Text style={styles.sectionLabel}>CONSUMO ESTE MÊS</Text>
            <Text style={styles.heroValue}>
              {stats.totalKwh.toFixed(1)}
              <Text style={styles.heroUnit}> kWh</Text>
            </Text>
            <Text style={styles.heroCost}>
              R${' '}
              {stats.totalCost < 1000
                ? stats.totalCost.toFixed(2)
                : (stats.totalCost / 1000).toFixed(1) + 'k'}{' '}
              estimado
            </Text>
            <View style={styles.effRow}>
              <Text style={styles.effLabel}>Eficiência</Text>
              <Text style={styles.effPct}>{stats.efficiency}%</Text>
            </View>
            <ProgressBar percent={stats.efficiency} />
          </View>

          <View style={styles.divider} />

          {/* ── Métricas ──────────────────────────────────────── */}
          <MetricRow icon="home" label="Ambientes" value={String(stats.environments)} sub="ativos" />
          <View style={styles.rowSep} />
          <MetricRow icon="cpu" label="Equipamentos" value={String(stats.equipments)} sub="cadastrados" />
          <View style={styles.rowSep} />
          <MetricRow icon="clock" label="Horário de pico" value="18h – 21h" />
          {stats.savingsPotential > 0 && (
            <>
              <View style={styles.rowSep} />
              <MetricRow
                icon="trending-down"
                label="Potencial de economia"
                value={`R$ ${stats.savingsPotential.toFixed(2)}`}
              />
            </>
          )}

          <View style={styles.divider} />

          {/* ── Semana ────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>ESTA SEMANA</Text>
          <View style={styles.weekChart}>
            {WEEK_DAYS.map((day, i) => {
              const active = i === todayIdx;
              return (
                <View key={i} style={styles.weekCol}>
                  <View style={styles.weekTrack}>
                    <View
                      style={[
                        styles.weekBar,
                        { height: `${WEEK_H[i]}%` },
                        active && styles.weekBarActive,
                      ]}
                    />
                  </View>
                  <Text style={[styles.weekDay, active && styles.weekDayActive]}>{day}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* ── Insights ──────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>INSIGHTS</Text>
          <View style={styles.insightItem}>
            <Feather name="moon" size={14} color="#E8A030" style={styles.insightIcon} />
            <Text style={styles.insightText}>
              Redistribua cargas fora do horário de pico (18h–21h) para reduzir custos.
            </Text>
          </View>
          <View style={styles.rowSep} />
          <View style={styles.insightItem}>
            <Feather name="zap-off" size={14} color="#9AA3B2" style={styles.insightIcon} />
            <Text style={styles.insightText}>
              Desligue equipamentos em standby fora do horário de uso.
            </Text>
          </View>
          <View style={styles.rowSep} />
          <View style={styles.insightItem}>
            <Feather name="info" size={14} color="#45AAF2" style={styles.insightIcon} />
            <Text style={styles.insightText}>
              Adicione tarifas nos ambientes para cálculos de custo precisos.
            </Text>
          </View>

          <View style={{ height: 48 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 18, paddingTop: 60 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  greeting: { fontSize: 13, color: '#9AA3B2', fontWeight: '400', marginBottom: 3 },
  userName: { fontSize: 26, color: colors.primary, fontWeight: '700', letterSpacing: -0.5 },
  bell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E05252',
    borderWidth: 1,
    borderColor: '#F5F7FA',
  },

  // Section label
  sectionLabel: {
    fontSize: 10,
    color: '#B0B8C8',
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 16,
  },

  // Hero
  heroSection: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  heroValue: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -2.5,
    lineHeight: 60,
    marginBottom: 6,
  },
  heroUnit: { fontSize: 24, fontWeight: '300', color: '#9AA3B2', letterSpacing: 0 },
  heroCost: { fontSize: 14, color: '#9AA3B2', fontWeight: '400', marginBottom: 24 },
  effRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  effLabel: { fontSize: 12, color: '#9AA3B2', fontWeight: '400' },
  effPct: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  progressTrack: { height: 3, backgroundColor: '#F0F2F8', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },

  // Dividers
  divider: { height: 1, backgroundColor: '#F0F2F8', marginVertical: 28 },
  rowSep: { height: 1, backgroundColor: '#F8F9FC' },

  // Metrics
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: '#fff',
    marginBottom: 22,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  metricIcon: { marginRight: 14 },
  metricLabel: { flex: 1, fontSize: 14, color: '#4A5568', fontWeight: '400' },
  metricRight: { alignItems: 'flex-end' },
  metricValue: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  metricSub: { fontSize: 11, color: '#B0B8C8', fontWeight: '400', marginTop: 1 },

  // Week chart
  weekChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 72,
    gap: 6,
    marginBottom: 0,
  },
  weekCol: { flex: 1, alignItems: 'center', gap: 7, height: '100%' },
  weekTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F0F2F8',
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  weekBar: { width: '100%', backgroundColor: '#D8DCE8', borderRadius: 3 },
  weekBarActive: { backgroundColor: colors.primary },
  weekDay: { fontSize: 10, color: '#C4CBDA', fontWeight: '500' },
  weekDayActive: { color: colors.primary, fontWeight: '700' },

  // Insights
  insightItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, gap: 12 },
  insightIcon: { marginTop: 1 },
  insightText: { flex: 1, fontSize: 13, color: '#6B7280', lineHeight: 19, fontWeight: '400' },
});
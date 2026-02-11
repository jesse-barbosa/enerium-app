import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';

const ENERGY_PRICE = 0.95;

export default function CreateEquipment() {
  const { environmentId } = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [hours, setHours] = useState('');
  const [days, setDays] = useState('');

  const watts = Number(power) || 0;
  const hoursDay = Number(hours) || 0;
  const daysMonth = Number(days) || 0;

  const monthlyKwh = (watts * hoursDay * daysMonth) / 1000;
  const estimatedCost = monthlyKwh * ENERGY_PRICE;

  async function handleSave() {
    if (!name || !power || !hours || !days) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const { error } = await supabase.from('equipments').insert({
      environment_id: environmentId,
      name,
      power_watts: watts,
      hours_per_day: hoursDay,
      days_per_month: daysMonth,
    });

    if (error) {
      Alert.alert('Erro ao salvar');
      return;
    }

    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Novo Equipamento</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* FORM */}
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Ar condicionado"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Potência (Watts)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Ex: 1200"
            value={power}
            onChangeText={setPower}
          />

          <Text style={styles.label}>Horas por dia</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Ex: 8"
            value={hours}
            onChangeText={setHours}
          />

          <Text style={styles.label}>Dias por mês</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Ex: 22"
            value={days}
            onChangeText={setDays}
          />
        </View>

        {/* RESULTADO EM TEMPO REAL */}
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Estimativa Mensal</Text>

          <View style={styles.resultRow}>
            <Ionicons name="flash" size={18} color={colors.primary} />
            <Text style={styles.resultText}>
              {monthlyKwh.toFixed(2)} kWh
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Ionicons name="cash-outline" size={18} color={colors.secondary} />
            <Text style={styles.resultText}>
              R$ {estimatedCost.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* BOTÃO */}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Equipamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: '#777',
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#F4F6F8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },

  resultCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 24,
  },

  resultTitle: {
    fontWeight: '700',
    marginBottom: 12,
    color: colors.text,
  },

  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  resultText: {
    marginLeft: 8,
    fontWeight: '600',
    color: colors.text,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
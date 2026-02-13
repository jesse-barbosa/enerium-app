import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';

const TYPES = [
  { label: 'Residencial', icon: 'home-outline' },
  { label: 'Comercial', icon: 'business-outline' },
  { label: 'Industrial', icon: 'build-outline' },
];

export default function CreateEnvironment() {
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [area, setArea] = useState('');
  const [tariff, setTariff] = useState('');

  const progress = step === 1 ? '50%' : '100%';

  async function save() {
    if (!name || !type || !area || !tariff) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Usuário não autenticado');
      return;
    }

    const { error } = await supabase.from('environments').insert({
      name,
      type,
      area_m2: Number(area),
      energy_tariff: Number(tariff),
      owner_id: user.id,
    });

    if (error) {
      console.error(error);

      Alert.alert('Erro ao salvar ambiente');
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

          <Text style={styles.title}>Novo Ambiente</Text>

          <View style={{ width: 22 }} />
        </View>

        {/* PROGRESS */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: progress }]} />
        </View>

        {/* STEP 1 */}
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informações básicas</Text>

            <Text style={styles.label}>Nome do ambiente</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Escritório principal"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Tipo</Text>

            <View style={styles.typeContainer}>
              {TYPES.map(t => (
                <TouchableOpacity
                  key={t.label}
                  style={[
                    styles.typeCard,
                    type === t.label && styles.typeCardActive,
                  ]}
                  onPress={() => setType(t.label)}
                >
                  <Ionicons
                    name={t.icon as any}
                    size={20}
                    color={type === t.label ? '#fff' : colors.primary}
                  />
                  <Text
                    style={[
                      styles.typeText,
                      type === t.label && { color: '#fff' },
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Área (m²)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Ex: 120"
              value={area}
              onChangeText={setArea}
            />

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                if (!name || !type || !area) {
                  Alert.alert('Preencha todos os campos');
                  return;
                }
                setStep(2);
              }}
            >
              <Text style={styles.nextText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Energia</Text>

            <Text style={styles.label}>Tarifa (R$/kWh)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Ex: 0.95"
              value={tariff}
              onChangeText={setTariff}
            />

            <View style={styles.previewBox}>
              <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.previewText}>
                A tarifa será usada para calcular o custo mensal
                estimado de todos os equipamentos.
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(1)}
              >
                <Text style={styles.backText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveText}>Salvar Ambiente</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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

  progressBar: {
    height: 6,
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    marginBottom: 20,
  },

  progressFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    color: colors.text,
  },

  label: {
    fontSize: 13,
    color: '#777',
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    backgroundColor: '#F4F6F8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },

  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  typeCard: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingVertical: 14,
    marginRight: 8,
    borderRadius: 14,
    alignItems: 'center',
  },

  typeCardActive: {
    backgroundColor: colors.primary,
  },

  typeText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },

  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },

  nextText: {
    color: '#fff',
    fontWeight: '700',
  },

  previewBox: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },

  previewText: {
    marginLeft: 8,
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },

  actions: {
    flexDirection: 'row',
    marginTop: 24,
  },

  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#EEE',
    alignItems: 'center',
    marginRight: 8,
  },

  backText: {
    fontWeight: '600',
    color: colors.text,
  },

  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});
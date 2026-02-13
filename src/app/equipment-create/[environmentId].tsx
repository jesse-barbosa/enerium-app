import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';

const { height } = Dimensions.get('window');
const ENERGY_PRICE = 0.95;

export default function CreateEquipmentModal({
    environmentId,
    onclose,
  }: {
    environmentId: string;
    onclose: () => void;
  }) {

  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);

  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [hours, setHours] = useState('');
  const [days, setDays] = useState('');

  useEffect(() => {
    translateY.value = withSpring(0);
    backdropOpacity.value = withTiming(1);
  }, []);

  function closeModal() {
    translateY.value = withSpring(height);
    backdropOpacity.value = withTiming(0);
    setTimeout(() => onclose(), 300);
  }

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value > 150) {
        runOnJS(closeModal)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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

    closeModal();
  }

  return (
    <View style={styles.container}>
      {/* SHEET */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              <View style={styles.handle} />

              <Text style={styles.title}>Novo Equipamento</Text>

              <View style={styles.card}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.label}>Potência (Watts)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={power}
                  onChangeText={setPower}
                />

                <Text style={styles.label}>Horas por dia</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={hours}
                  onChangeText={setHours}
                />

                <Text style={styles.label}>Dias por mês</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={days}
                  onChangeText={setDays}
                />
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Estimativa</Text>
                <Text style={styles.resultText}>
                  {monthlyKwh.toFixed(2)} kWh
                </Text>
                <Text style={styles.resultText}>
                  R$ {estimatedCost.toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',


  },

  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
    width: '100%',
  },

  handle: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: colors.text,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  label: {
    marginTop: 12,
    fontSize: 13,
    color: '#777',
  },

  input: {
    backgroundColor: '#F4F6F8',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },

  resultCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  resultTitle: {
    fontWeight: '700',
    marginBottom: 10,
  },

  resultText: {
    fontWeight: '600',
    marginTop: 4,
  },

  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
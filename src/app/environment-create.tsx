import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';

export default function CreateEnvironment() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [area, setArea] = useState('');
  const [tariff, setTariff] = useState('');

  const save = async () => {
    await supabase.from('environments').insert({
      name,
      type,
      area_m2: Number(area),
      energy_tariff: Number(tariff),
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nome" style={styles.input} onChangeText={setName} />
      <TextInput placeholder="Tipo" style={styles.input} onChangeText={setType} />
      <TextInput placeholder="Área (m²)" keyboardType="numeric" style={styles.input} onChangeText={setArea} />
      <TextInput placeholder="Tarifa R$/kWh" keyboardType="numeric" style={styles.input} onChangeText={setTariff} />

      <TouchableOpacity style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
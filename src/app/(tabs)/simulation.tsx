import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { calculateEnvironmentSimulation } from '../../lib/simulation';
import { supabase } from '../../lib/supabase';

export default function Simulation() {
  const [result, setResult] = useState<any>(null);

  const simulate = async () => {
    const { data: envs } = await supabase.from('environments').select('*').limit(1);
    const env = envs?.[0];

    const { data: equipments } = await supabase
      .from('equipments')
      .select('*')
      .eq('environment_id', env.id);

    const simulation = calculateEnvironmentSimulation(
      equipments || [],
      env.energy_tariff
    );

    setResult(simulation);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={simulate}>
        <Text style={styles.buttonText}>Simular Consumo</Text>
      </TouchableOpacity>

      {result && (
        <>
          <Text>Total kWh/mês: {result.totalKwh.toFixed(2)}</Text>
          <Text>Custo estimado: R$ {result.totalCost.toFixed(2)}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  button: { backgroundColor: '#FF6A00', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
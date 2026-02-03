import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function Equipments() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('equipments').select('*').then(({ data }) => {
      setData(data || []);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equipamentos</Text>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.power_watts}W • {item.hours_per_day}h/dia</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  card: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8 },
  name: { fontWeight: 'bold' },
});
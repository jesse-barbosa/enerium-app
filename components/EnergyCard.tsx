import { StyleSheet, Text } from 'react-native';
import { Card } from 'react-native-paper';

type Props = {
  title: string;
  value: string;
};

export default function EnergyCard({ title, value }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  title: { fontSize: 16, color: '#555' },
  value: { fontSize: 20, fontWeight: 'bold', color: '#222' },
});
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  text: string;
};

export default function RecommendationItem({ text }: Props) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="lightbulb-outline" size={20} color="#4caf50" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  text: { marginLeft: 8, fontSize: 16, color: '#333' },
});
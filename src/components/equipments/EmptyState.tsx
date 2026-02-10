import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

export function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name="business-outline"
          size={36}
          color={colors.primary}
        />
      </View>

      <Text style={styles.title}>
        Nenhum equipamento por aqui
      </Text>

      <Text style={styles.subtitle}>
        Crie equipamentos para simular, analisar e otimizar
        o consumo energético de forma inteligente.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary + '15', // leve transparência
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#777',
    marginTop: 8,
  },
});

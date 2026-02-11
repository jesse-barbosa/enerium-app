import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';

// interface
interface Props {
    title: string;
}

export function AppHeader ({ title }: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>

    {/* Botão para notificações */}
    <View style={styles.notificationsButton}>
      <Ionicons name="notifications" size={26} color={colors.darkGray} />
    </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 82,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 26,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationsButton: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.gray
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
});
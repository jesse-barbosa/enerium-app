import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';

interface Props {
  title: string;
  onNotificationsPress?: () => void;
}

export function AppHeader({ title, onNotificationsPress }: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(450)} style={styles.wrapper}>
      <LinearGradient
        colors={["#ffffff", "#f7f7f8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Title block */}
        <View style={styles.titleContainer}>
          <View style={styles.titleAccent} />
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>

        {/* Modern notifications button */}
        <Pressable
          onPress={onNotificationsPress}
          android_ripple={{ color: '#00000010', borderless: true }}
          style={({ pressed }) => [
            styles.notificationWrapper,
            pressed && { transform: [{ scale: 0.96 }], opacity: 0.85 },
          ]}
        >
          <View style={styles.notificationInner}>
            <Ionicons name="notifications-outline" size={22} color="#111" />
            <View style={styles.dot} />
          </View>
        </Pressable>
      </LinearGradient>

      {/* subtle bottom divider */}
      <View style={styles.bottomFade} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
  },
  container: {
    height: 88,
    paddingHorizontal: 18,
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // TITLE
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '75%',
  },
  titleAccent: {
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: colors.primary || '#6366f1',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: '#111',
  },

  // NOTIFICATION BUTTON (glass / modern)
  notificationWrapper: {
    borderRadius: 26,
    backgroundColor: '#ffffffcc',
    padding: 2,
  },
  notificationInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  dot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3b30',
  },

  // bottom fade divider (premium feel)
  bottomFade: {
    height: 1,
    backgroundColor: '#00000010',
    marginHorizontal: 16,
  },
});
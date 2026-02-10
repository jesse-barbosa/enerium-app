import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

type Props = {
  focused: boolean;
  color: string;
  size: number;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
};

export function AnimatedTabIcon({
  focused,
  color,
  size,
  activeIcon,
  inactiveIcon,
}: Props) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, {
      damping: 16,
      stiffness: 180,
      mass: 0.9,
    });
  }, [focused]);

  const activeStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: 0.85 + progress.value * 0.35 },
      { translateY: (1 - progress.value) * 10 },
    ],
  }));

  const inactiveStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { scale: 1 - progress.value * 0.2 },
      { translateY: -progress.value * 6 },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, inactiveStyle]}>
        <Ionicons name={inactiveIcon} size={size} color={color} />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, activeStyle]}>
        <Ionicons name={activeIcon} size={size} color={color} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
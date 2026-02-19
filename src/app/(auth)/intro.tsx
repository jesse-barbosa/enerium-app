import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.2;

// =====================================================
// DATA
// =====================================================

const slides = [
  {
    id: 'welcome',
    eyebrow: 'BEM-VINDO AO ENERIUM!',
    title: 'Energia\nInteligente.',
    titleSize: 44,
    desc: 'Monitore, entenda e reduza seu consumo de energia com precisão.',
    deviceImage: require('../../../assets/images/city-photo.png'),
  },
  {
    id: 'register',
    eyebrow: 'COMECE AGORA',
    title: 'Sua conta,\nseu controle.',
    titleSize: 36,
    desc: 'Crie sua conta gratuitamente e tenha análises em tempo real.',
    deviceImage: require('../../../assets/images/register-device-frame.png'),
  },
  {
    id: 'sync',
    eyebrow: 'MÚLTIPLOS DISPOSITIVOS',
    title: 'Leve com\nvocê.',
    titleSize: 36,
    desc: 'Acesse do celular, tablet ou computador.',
    deviceImage: require('../../../assets/images/city-photo.png'),
  },
  {
    id: 'ready',
    eyebrow: 'TUDO PRONTO',
    title: 'Vamos\neconomizar.',
    titleSize: 42,
    desc: 'Agora você tem controle total da sua energia.',
    deviceImage: null,
  },
];

// =====================================================
// ROOT
// =====================================================

export default function Intro() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <IntroContent onDone={() => router.replace('/(auth)/login')} />
    </GestureHandlerRootView>
  );
}

function Page({ slide, onNext, isLast }: any) {
  const isWelcome = slide.id === 'welcome';

  return (
    <View style={{ width, height, paddingHorizontal: 24 }}>
      {/* WELCOME HERO */}
      {isWelcome && slide.deviceImage && (
        <Image
          source={slide.deviceImage}
          style={{
            position: 'absolute',
            width,
            height: height * 0.65,
            top: 0,
          }}
          resizeMode="cover"
        />
      )}

      {/* NORMAL IMAGE */}
      {!isWelcome && slide.deviceImage && (
        <View style={{ alignItems: 'center', marginTop: 120 }}>
          <Image
            source={slide.deviceImage}
            style={{
              width: width * 0.7,
              height: height * 0.60,
            }}
          />
        </View>
      )}

      {/* CONTENT */}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: Platform.OS === 'ios' ? 60 : 40,
        }}
      >
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          {slide.eyebrow}
        </Text>

        <Text style={[styles.title, { fontSize: slide.titleSize }]}>
          {slide.title}
        </Text>

        <Text style={styles.desc}>{slide.desc}</Text>

        {/* CTA */}
        <Pressable style={styles.cta} onPress={onNext}>
          <Text style={styles.ctaText}>
            {isLast ? 'Começar agora' : 'Continuar'}
          </Text>

          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Ionicons
              name={isLast ? 'checkmark' : 'arrow-forward'}
              size={15}
              color="#fff"
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

// =====================================================
// MAIN
// =====================================================

function IntroContent({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);

  const translateX = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const snapTo = (target: number) => {
    'worklet';

    const clamped = Math.max(0, Math.min(slides.length - 1, target));
    isAnimating.value = true;

    translateX.value = withTiming(-clamped * width, { duration: 260 }, (f) => {
      if (f) {
        isAnimating.value = false;
        runOnJS(setIndex)(clamped);
      }
    });
  };

  const next = () => {
    if (index === slides.length - 1) onDone();
    else snapTo(index + 1);
  };

  // ================= GESTURE =================
  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      if (isAnimating.value) return;
      translateX.value = -index * width + e.translationX;
    })
    .onEnd((e) => {
      const moved = e.translationX;

      if (moved < -SWIPE_THRESHOLD) snapTo(index + 1);
      else if (moved > SWIPE_THRESHOLD) snapTo(index - 1);
      else snapTo(index);
    });

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar barStyle="dark-content" />

      {/* TOP HUD */}
      <View style={styles.topBar}>
        <View style={styles.pills}>
          {slides.map((_, i) => (
            <PillDot
              key={i}
              active={i === index}
              passed={i < index}
              color={colors.primary}
            />
          ))}
        </View>

        {index < slides.length - 1 && (
          <Pressable onPress={onDone} style={styles.skipWrapper}>
            <Text style={styles.skip}>Pular</Text>
          </Pressable>
        )}
      </View>

      {/* SWIPER */}
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              width: width * slides.length,
              height: '100%',
            },
            sliderStyle,
          ]}
        >
          {slides.map((slide, i) => (
            <Page
              key={slide.id}
              slide={slide}
              isLast={i === slides.length - 1}
              onNext={next}
            />
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

// =====================================================
// DOT
// =====================================================

function PillDot({ active, passed, color }: any) {
  const w = useSharedValue(active ? 22 : 6);
  const op = useSharedValue(active ? 1 : passed ? 0.4 : 0.2);

  useEffect(() => {
    w.value = withSpring(active ? 22 : 6);
    op.value = withTiming(active ? 1 : passed ? 0.4 : 0.2);
  }, [active, passed]);

  const style = useAnimatedStyle(() => ({
    width: w.value,
    opacity: op.value,
  }));

  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'flex-end',
  },

  slider: {
    flexDirection: 'row',
    width: width * slides.length,
  },

  card: {
    width,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 46 : 28,
  },

  inner: {
    borderRadius: 28,
    overflow: 'hidden',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  title: {
    fontWeight: '800',
    marginVertical: 8,
  },

  desc: {
    fontSize: 14,
    opacity: 0.7,
  },

  cta: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ctaText: {
    color: '#000',
    opacity: 0.5,
  },

  badge: {
    width: 45,
    height: 45,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dot: {
    height: 4,
    borderRadius: 2,
    zIndex: 1,
  },

  pills: {
    flexDirection: 'row',
    gap: 5,
  },

  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 40,
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  skipWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    zIndex: 1,
  },
  skip: { fontSize: 14, opacity: 0.5},

  mediaArea: {
    position: 'absolute',
    bottom: 300,
    width: '100%',
    alignItems: 'center',
  },

  deviceImg: {
    width: width * 0.64,
    height: height * 0.37,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

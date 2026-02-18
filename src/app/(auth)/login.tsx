import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Entry animations
  const masterFade = useRef(new Animated.Value(0)).current;
  const headingSlide = useRef(new Animated.Value(24)).current;
  const formSlide = useRef(new Animated.Value(32)).current;
  const buttonSlide = useRef(new Animated.Value(20)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Input focus animations
  const emailFocusAnim = useRef(new Animated.Value(0)).current;
  const passwordFocusAnim = useRef(new Animated.Value(0)).current;

  // Subtle background circle pulse
  const circlePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entry
    Animated.stagger(80, [
      Animated.parallel([
        Animated.timing(masterFade, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(headingSlide, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(formSlide, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(buttonSlide, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    // Breathe animation for background accent
    Animated.loop(
      Animated.sequence([
        Animated.timing(circlePulse, { toValue: 1.08, duration: 4500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(circlePulse, { toValue: 1, duration: 4500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const focusInput = (anim: Animated.Value) => {
    Animated.timing(anim, { toValue: 1, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  };

  const blurInput = (anim: Animated.Value) => {
    Animated.timing(anim, { toValue: 0, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  };

  const animateShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleSignIn = async () => {
    if (!email.trim()) {
      animateShake();
      Alert.alert('Atenção', 'Por favor, insira seu email.');
      return;
    }
    if (!password.trim()) {
      animateShake();
      Alert.alert('Atenção', 'Por favor, insira sua senha.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      animateShake();
      Alert.alert('Email inválido', 'Por favor, insira um email válido.');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      await signIn(email, password);
      Animated.timing(masterFade, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
        router.replace('/');
      });
    } catch (error) {
      setIsLoading(false);
      animateShake();

      let msg = 'Erro ao fazer login. Tente novamente.';
      if (error instanceof Error) {
        if (error.message.includes('invalid-credential')) msg = 'Email ou senha incorretos.';
        else if (error.message.includes('network')) msg = 'Sem conexão. Verifique sua internet.';
        else if (error.message.includes('too-many-requests')) msg = 'Muitas tentativas. Aguarde e tente novamente.';
        else msg = error.message;
      }
      Alert.alert('Falha no login', msg);
    }
  };

  const emailUnderline = emailFocusAnim.interpolate({ inputRange: [0, 1], outputRange: ['#E8E8EC', colors.primary] });
  const passwordUnderline = passwordFocusAnim.interpolate({ inputRange: [0, 1], outputRange: ['#E8E8EC', colors.primary] });

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Decorative background accent */}
      <Animated.View
        style={[
          styles.bgAccent,
          { transform: [{ scale: circlePulse }] },
        ]}
        pointerEvents="none"
      />

      <Animated.View style={[styles.inner, { opacity: masterFade }]}>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.navigate('/(auth)/intro')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={20} color="#1A1A2E" />
        </TouchableOpacity>

        {/* Heading */}
        <Animated.View style={[styles.headingBlock, { transform: [{ translateY: headingSlide }] }]}>
          <Text style={styles.eyebrow}>BEM-VINDO DE VOLTA</Text>
          <Text style={styles.heading}>Entrar</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          style={[
            styles.form,
            { transform: [{ translateY: formSlide }, { translateX: shakeAnim }] },
          ]}
        >
          {/* Email field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.fieldRow}>
              <Ionicons name="mail-outline" size={17} color={emailFocused ? colors.primary : '#9A9AAF'} style={styles.fieldIcon} />
              <TextInput
                style={styles.fieldInput}
                placeholder="seu@email.com"
                placeholderTextColor="#BBBBC8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => { setEmailFocused(true); focusInput(emailFocusAnim); }}
                onBlur={() => { setEmailFocused(false); blurInput(emailFocusAnim); }}
              />
            </View>
            <Animated.View style={[styles.fieldUnderline, { backgroundColor: emailUnderline }]} />
          </View>

          {/* Password field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Senha</Text>
            <View style={styles.fieldRow}>
              <Ionicons name="lock-closed-outline" size={17} color={passwordFocused ? colors.primary : '#9A9AAF'} style={styles.fieldIcon} />
              <TextInput
                style={styles.fieldInput}
                placeholder="••••••••"
                placeholderTextColor="#BBBBC8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => { setPasswordFocused(true); focusInput(passwordFocusAnim); }}
                onBlur={() => { setPasswordFocused(false); blurInput(passwordFocusAnim); }}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color="#9A9AAF"
                />
              </Pressable>
            </View>
            <Animated.View style={[styles.fieldUnderline, { backgroundColor: passwordUnderline }]} />
          </View>
        </Animated.View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Bottom actions */}
        <Animated.View style={[styles.bottomBlock, { transform: [{ translateY: buttonSlide }] }]}>
          {/* CTA */}
          <TouchableOpacity
            style={[styles.cta, isLoading && styles.ctaDisabled]}
            onPress={handleSignIn}
            disabled={isLoading}
            activeOpacity={0.88}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.ctaText}>Entrar</Text>
                <Ionicons name="arrow-forward" size={17} color="#fff" style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Não tem conta?</Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity hitSlop={{ top: 8, bottom: 8 }}>
                <Text style={styles.registerLink}>Criar conta</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>

      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  // Soft decorative circle top-right
  bgAccent: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: colors.primary,
    opacity: 0.055,
    top: -120,
    right: -80,
  },

  inner: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 64 : 44,
    paddingBottom: 36,
    paddingHorizontal: 32,
  },

  // Back
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },

  // Heading
  headingBlock: {
    marginBottom: 52,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: colors.primary,
    marginBottom: 10,
    opacity: 0.85,
  },
  heading: {
    fontSize: 38,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -1,
    lineHeight: 42,
  },

  // Form
  form: {
    gap: 36,
  },

  fieldGroup: {
    gap: 0,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9A9AAF',
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  fieldIcon: {
    marginRight: 12,
  },
  fieldInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: '500',
    letterSpacing: 0.1,
    padding: 0,
  },
  fieldUnderline: {
    height: 1.5,
    borderRadius: 2,
  },

  // Bottom
  bottomBlock: {
    gap: 0,
  },

  cta: {
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 22,
  },
  registerText: {
    color: '#9A9AAF',
    fontSize: 14,
    fontWeight: '500',
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
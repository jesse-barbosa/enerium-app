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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function Register() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // Entry animations
  const masterFade = useRef(new Animated.Value(0)).current;
  const headingSlide = useRef(new Animated.Value(24)).current;
  const formSlide = useRef(new Animated.Value(32)).current;
  const buttonSlide = useRef(new Animated.Value(20)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Input focus anims
  const nameFocusAnim = useRef(new Animated.Value(0)).current;
  const emailFocusAnim = useRef(new Animated.Value(0)).current;
  const passwordFocusAnim = useRef(new Animated.Value(0)).current;
  const confirmFocusAnim = useRef(new Animated.Value(0)).current;

  // Password strength progress
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Background accent
  const circlePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(80, [
      Animated.parallel([
        Animated.timing(masterFade, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(headingSlide, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(formSlide, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(buttonSlide, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circlePulse, { toValue: 1.08, duration: 4500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(circlePulse, { toValue: 1, duration: 4500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Password strength
  const getPasswordStrength = (): PasswordStrength => {
    if (!password) return { score: 0, label: '', color: '#E8E8EC' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 1, label: 'Fraca', color: '#FF6B6B' };
    if (score <= 3) return { score: 2, label: 'Média', color: '#FFB347' };
    if (score <= 4) return { score: 3, label: 'Boa', color: '#52C41A' };
    return { score: 4, label: 'Excelente', color: '#00C896' };
  };

  const passwordStrength = getPasswordStrength();

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: passwordStrength.score / 4,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [passwordStrength.score]);

  const focusInput = (anim: Animated.Value) => {
    Animated.timing(anim, { toValue: 1, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  };

  const blurInput = (anim: Animated.Value) => {
    Animated.timing(anim, { toValue: 0, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  };

  const getUnderlineColor = (anim: Animated.Value) =>
    anim.interpolate({ inputRange: [0, 1], outputRange: ['#E8E8EC', colors.primary] });

  const animateShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      animateShake(); Alert.alert('Atenção', 'Por favor, insira seu nome.'); return;
    }
    if (!email.trim()) {
      animateShake(); Alert.alert('Atenção', 'Por favor, insira seu email.'); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      animateShake(); Alert.alert('Email inválido', 'Por favor, insira um email válido.'); return;
    }
    if (!password.trim()) {
      animateShake(); Alert.alert('Atenção', 'Por favor, insira sua senha.'); return;
    }
    if (password.length < 8) {
      animateShake(); Alert.alert('Senha fraca', 'A senha deve ter pelo menos 8 caracteres.'); return;
    }
    if (password !== confirmPassword) {
      animateShake(); Alert.alert('Senhas diferentes', 'As senhas não coincidem.'); return;
    }
    if (!acceptedTerms) {
      animateShake(); Alert.alert('Termos de uso', 'Aceite os termos para continuar.'); return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      await signUp(email, password, name);
      Alert.alert('Conta criada! 🎉', 'Bem-vindo ao Enerium!', [
        {
          text: 'Começar',
          onPress: () => {
            Animated.timing(masterFade, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
              router.replace('/');
            });
          },
        },
      ]);
    } catch (error) {
      setIsLoading(false);
      animateShake();

      let msg = 'Erro ao criar conta. Tente novamente.';
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) msg = 'Este email já está cadastrado.';
        else if (error.message.includes('network')) msg = 'Sem conexão. Verifique sua internet.';
        else if (error.message.includes('weak-password')) msg = 'Senha muito fraca. Use uma mais forte.';
        else msg = error.message;
      }
      Alert.alert('Erro', msg);
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Decorative accent — bottom-left to mirror login's top-right */}
      <Animated.View
        style={[styles.bgAccent, { transform: [{ scale: circlePulse }] }]}
        pointerEvents="none"
      />

      <Animated.View style={[styles.inner, { opacity: masterFade }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={20} color="#1A1A2E" />
          </TouchableOpacity>

          {/* Heading */}
          <Animated.View style={[styles.headingBlock, { transform: [{ translateY: headingSlide }] }]}>
            <Text style={styles.eyebrow}>CRIE SUA CONTA</Text>
            <Text style={styles.heading}>Registrar</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            style={[
              styles.form,
              { transform: [{ translateY: formSlide }, { translateX: shakeAnim }] },
            ]}
          >
            {/* Nome */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nome completo</Text>
              <View style={styles.fieldRow}>
                <Ionicons name="person-outline" size={17} color={nameFocused ? colors.primary : '#9A9AAF'} style={styles.fieldIcon} />
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Seu nome"
                  placeholderTextColor="#BBBBC8"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  onFocus={() => { setNameFocused(true); focusInput(nameFocusAnim); }}
                  onBlur={() => { setNameFocused(false); blurInput(nameFocusAnim); }}
                />
              </View>
              <Animated.View style={[styles.fieldUnderline, { backgroundColor: getUnderlineColor(nameFocusAnim) }]} />
            </View>

            {/* Email */}
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => { setEmailFocused(true); focusInput(emailFocusAnim); }}
                  onBlur={() => { setEmailFocused(false); blurInput(emailFocusAnim); }}
                />
              </View>
              <Animated.View style={[styles.fieldUnderline, { backgroundColor: getUnderlineColor(emailFocusAnim) }]} />
            </View>

            {/* Senha */}
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
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color="#9A9AAF" />
                </Pressable>
              </View>
              <Animated.View style={[styles.fieldUnderline, { backgroundColor: getUnderlineColor(passwordFocusAnim) }]} />

              {/* Strength indicator */}
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthTrack}>
                    <Animated.View
                      style={[
                        styles.strengthFill,
                        { width: progressWidth, backgroundColor: passwordStrength.color },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirmar senha */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Confirmar senha</Text>
              <View style={styles.fieldRow}>
                <Ionicons name="lock-closed-outline" size={17} color={confirmPasswordFocused ? colors.primary : '#9A9AAF'} style={styles.fieldIcon} />
                <TextInput
                  style={styles.fieldInput}
                  placeholder="••••••••"
                  placeholderTextColor="#BBBBC8"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => { setConfirmPasswordFocused(true); focusInput(confirmFocusAnim); }}
                  onBlur={() => { setConfirmPasswordFocused(false); blurInput(confirmFocusAnim); }}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color="#9A9AAF" />
                </Pressable>
              </View>
              <Animated.View style={[styles.fieldUnderline, { backgroundColor: getUnderlineColor(confirmFocusAnim) }]} />
            </View>

            {/* Terms */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              activeOpacity={0.75}
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
                {acceptedTerms && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                Li e aceito os{' '}
                <Text style={styles.termsLink}>termos de uso</Text>
                {' '}do Enerium
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* CTA */}
          <Animated.View style={[styles.bottomBlock, { transform: [{ translateY: buttonSlide }] }]}>
            <TouchableOpacity
              style={[styles.cta, isLoading && styles.ctaDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.88}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.ctaText}>Criar Conta</Text>
                  <Ionicons name="arrow-forward" size={17} color="#fff" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Já possui conta?</Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity hitSlop={{ top: 8, bottom: 8 }}>
                  <Text style={styles.loginLink}>Entrar</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  bgAccent: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.primary,
    opacity: 0.055,
    bottom: -100,
    left: -80,
  },

  inner: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 64 : 44,
    paddingBottom: 40,
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
    marginBottom: 44,
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
    gap: 32,
    marginBottom: 36,
  },

  fieldGroup: {},

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

  // Strength
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  strengthTrack: {
    flex: 1,
    height: 3,
    backgroundColor: '#E8E8EC',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 56,
    textAlign: 'right',
  },

  // Terms
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#DDDDE8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#7A7A8C',
    lineHeight: 19,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
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

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 22,
  },
  loginText: {
    color: '#9A9AAF',
    fontSize: 14,
    fontWeight: '500',
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
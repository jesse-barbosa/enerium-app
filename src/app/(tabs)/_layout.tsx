import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedTabIcon } from '../../components/AnimatedTabIcon';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';

export default function TabsLayout() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!user) router.replace('/(auth)/intro');
  }, [user]);

  if (!user) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: true,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9aa0a6',

        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          marginHorizontal: 12,
          bottom: insets.bottom + 10,

          height: 70,
          paddingBottom: 8,
          paddingTop: 10,

          borderRadius: 22,
          backgroundColor: '#ffffffff',

          borderTopWidth: 0,

          // sombra iOS
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },

          // sombra Android
          elevation: 14,
        },

        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: (props) => (
            <AnimatedTabIcon {...props} activeIcon="home" inactiveIcon="home-outline" />
          ),
        }}
      />

      <Tabs.Screen
        name="environments"
        options={{
          title: 'Ambientes',
          tabBarIcon: (props) => (
            <AnimatedTabIcon {...props} activeIcon="business" inactiveIcon="business-outline" />
          ),
        }}
      />

      <Tabs.Screen
        name="equipments"
        options={{
          title: 'Equipamentos',
          tabBarIcon: (props) => (
            <AnimatedTabIcon {...props} activeIcon="hardware-chip" inactiveIcon="hardware-chip-outline" />
          ),
        }}
      />

      <Tabs.Screen
        name="simulation"
        options={{
          title: 'Simular',
          tabBarIcon: (props) => (
            <AnimatedTabIcon {...props} activeIcon="flash" inactiveIcon="flash-outline" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: (props) => (
            <AnimatedTabIcon {...props} activeIcon="person" inactiveIcon="person-outline" />
          ),
        }}
      />
    </Tabs>
  );
}
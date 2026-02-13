import { router, Tabs } from 'expo-router';
import { AnimatedTabIcon } from '../../components/AnimatedTabIcon';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';

export default function TabsLayout() {
  const { user } = useAuth();

  // se não existe user -> login
  if (!user) {
    router.replace('/(auth)/login');
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 64,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: (props) => (
            <AnimatedTabIcon
              {...props}
              activeIcon="home"
              inactiveIcon="home-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="environments"
        options={{
          title: 'Ambientes',
          tabBarIcon: (props) => (
            <AnimatedTabIcon
              {...props}
              activeIcon="business"
              inactiveIcon="business-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="equipments"
        options={{
          title: 'Equipamentos',
          tabBarIcon: (props) => (
            <AnimatedTabIcon
              {...props}
              activeIcon="hardware-chip"
              inactiveIcon="hardware-chip-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="simulation"
        options={{
          title: 'Simular',
          tabBarIcon: (props) => (
            <AnimatedTabIcon
              {...props}
              activeIcon="flash"
              inactiveIcon="flash-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: (props) => (
            <AnimatedTabIcon
              {...props}
              activeIcon="person"
              inactiveIcon="person-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}
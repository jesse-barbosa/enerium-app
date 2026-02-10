import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

import { AppHeader } from '../../components/layout/AppHeader';

export default function Profile() {
  const router = useRouter();

  const { user } = useAuth();
  const userName = user?.user_metadata?.name;

  const handleLogout = async () => {
    console.log("Encerrando sessão...");

    await supabase.auth.signOut();

    // Redireciona para a tela de login
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Meu Perfil"
      />

      <View style={styles.card}>
        {/* Avatar */}
        <View style={{ width: 115, height: 115, backgroundColor: '#ccc', borderRadius: 100, marginBottom: 12 }} />

        <Text style={styles.username}>{userName || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || 'example@me.com'}</Text>
      </View>

      {/* Seções */}
      <View style={{ flex: 1 }}>

      </View>

      <View style={styles.logoutButtonContainer}>
        {/* LogOut button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleLogout()}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  email: {
    fontSize: 16,
    color: '#666'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    margin: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 24,

    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 4
  },
  logoutButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12
  },
  logoutButton: {
    backgroundColor: '#ffffffff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 14,
    borderRadius: 8
  },
  logoutButtonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
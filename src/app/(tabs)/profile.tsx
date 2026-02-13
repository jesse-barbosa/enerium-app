import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { AppHeader } from '../../components/layout/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const userName = user?.user_metadata?.name;

  // Estados para configurações
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowDataCollection, setAllowDataCollection] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Estados para modais
  const [editNameModal, setEditNameModal] = useState(false);
  const [editEmailModal, setEditEmailModal] = useState(false);
  const [editPasswordModal, setEditPasswordModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  // Estados para inputs
  const [newName, setNewName] = useState(userName || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleLogout = async () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            console.log("Encerrando sessão...");
            await supabase.auth.signOut();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: newName }
      });

      if (error) throw error;

      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
      setEditNameModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o nome');
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      Alert.alert('Erro', 'Digite um e-mail válido');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      Alert.alert(
        'Confirmação necessária', 
        'Um e-mail de confirmação foi enviado para o novo endereço. Verifique sua caixa de entrada.'
      );
      setEditEmailModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o e-mail');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
      setEditPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a senha');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== 'deletar') {
      Alert.alert('Erro', 'Digite "deletar" para confirmar');
      return;
    }

    Alert.alert(
      'ATENÇÃO',
      'Esta ação é irreversível! Todos os seus dados serão permanentemente excluídos. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar definitivamente',
          style: 'destructive',
          onPress: async () => {
            try {
              // Aqui você deve implementar a lógica de deletar dados do usuário
              // e depois deletar a conta do Supabase Auth
              
              Alert.alert(
                'Conta deletada', 
                'Sua conta foi deletada com sucesso. Sentiremos sua falta.'
              );
              
              await supabase.auth.signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a conta');
            }
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar dados',
      'Seus dados serão enviados para o e-mail cadastrado em até 48 horas.',
      [{ text: 'OK' }]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpar cache',
      'Isso irá liberar espaço no seu dispositivo. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          onPress: () => {
            Alert.alert('Sucesso', 'Cache limpo com sucesso!');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Meu Perfil" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Card de Perfil */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.avatarContainer}>
            <View style={styles.avatar} />
            <View style={styles.editAvatarBadge}>
              <Text style={styles.editAvatarText}>
                <Ionicons name="pencil" size={18} color="#fff" />
              </Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.username}>{userName || 'Usuário'}</Text>
          <Text style={styles.email}>{user?.email || 'example@me.com'}</Text>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Editar Perfil Completo</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Informações da Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Conta</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setEditNameModal(true)}
          >
            <Text style={styles.menuItemText}>Nome</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>{userName || 'Adicionar'}</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setEditEmailModal(true)}
          >
            <Text style={styles.menuItemText}>E-mail</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>{user?.email}</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Telefone</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>Adicionar</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Data de Nascimento</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>Adicionar</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Endereço</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>Adicionar</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Seção: Segurança e Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança e Privacidade</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setEditPasswordModal(true)}
          >
            <Text style={styles.menuItemText}>Alterar Senha</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Autenticação de Dois Fatores</Text>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={twoFactorEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Autenticação Biométrica</Text>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={biometricEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Dispositivos Conectados</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>3 dispositivos</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Sessões Ativas</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>Ver todas</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Seção: Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Ativar Notificações</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Notificações por E-mail</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={emailNotifications ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Notificações Push</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={pushNotifications ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>E-mails de Marketing</Text>
            <Switch
              value={marketingEmails}
              onValueChange={setMarketingEmails}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={marketingEmails ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Seção: Preferências */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Modo Escuro</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Idioma</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>Português (BR)</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Fuso Horário</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>GMT-3</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Moeda Padrão</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>BRL (R$)</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Seção: Dados e Armazenamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados e Armazenamento</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleExportData}
          >
            <Text style={styles.menuItemText}>Exportar Meus Dados</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleClearCache}
          >
            <Text style={styles.menuItemText}>Limpar Cache</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>245 MB</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Uso de Armazenamento</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>1.2 GB</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Seção: Ajuda e Suporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ajuda e Suporte</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Central de Ajuda</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Fale Conosco</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Reportar um Problema</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Sugestões de Melhorias</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Perguntas Frequentes (FAQ)</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Sobre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Versão do App</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>1.0.0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Termos de Uso</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Política de Privacidade</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Licenças de Código Aberto</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Avaliações e Feedback</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Zona de Perigo */}
        <View style={[styles.section, styles.dangerSection]}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Zona de Perigo</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.dangerItem]}
            onPress={() => setDeleteAccountModal(true)}
          >
            <Text style={styles.dangerText}>Deletar Conta</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.dangerItem]}>
            <Text style={styles.dangerText}>Desativar Conta Temporariamente</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Logout */}
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal: Editar Nome */}
      <Modal
        visible={editNameModal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Digite seu nome"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setEditNameModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdateName}
              >
                <Text style={styles.modalButtonTextConfirm}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Editar E-mail */}
      <Modal
        visible={editEmailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditEmailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar E-mail</Text>
            <Text style={styles.modalDescription}>
              Um e-mail de confirmação será enviado para o novo endereço.
            </Text>
            
            <TextInput
              style={styles.input}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Digite o novo e-mail"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setEditEmailModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdateEmail}
              >
                <Text style={styles.modalButtonTextConfirm}>Atualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Alterar Senha */}
      <Modal
        visible={editPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>
            
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Senha atual"
              placeholderTextColor="#999"
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nova senha (mín. 6 caracteres)"
              placeholderTextColor="#999"
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar nova senha"
              placeholderTextColor="#999"
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setEditPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdatePassword}
              >
                <Text style={styles.modalButtonTextConfirm}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Deletar Conta */}
      <Modal
        visible={deleteAccountModal}
        transparent
        animationType="slide"
        onRequestClose={() => setDeleteAccountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: '#D32F2F' }]}>⚠️ Deletar Conta</Text>
            <Text style={styles.modalDescription}>
              Esta ação é <Text style={{ fontWeight: 'bold' }}>IRREVERSÍVEL</Text>.
              Todos os seus dados serão permanentemente excluídos.
            </Text>
            <Text style={[styles.modalDescription, { marginTop: 12, fontSize: 14 }]}>
              Digite <Text style={{ fontWeight: 'bold' }}>"deletar"</Text> para confirmar:
            </Text>
            
            <TextInput
              style={styles.input}
              value={deleteConfirmation}
              onChangeText={setDeleteConfirmation}
              placeholder='Digite "deletar"'
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setDeleteAccountModal(false);
                  setDeleteConfirmation('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDanger]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.modalButtonTextDanger}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  scrollView: {
    flex: 1
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000'
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    margin: 16,
    marginBottom: 8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: '#E0E0E0',
    borderRadius: 50
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: '#000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff'
  },
  editAvatarText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  editProfileButton: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderRadius: 20
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0'
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400'
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  menuItemValue: {
    fontSize: 15,
    color: '#666'
  },
  menuItemArrow: {
    fontSize: 22,
    color: '#999',
    fontWeight: '300'
  },
  dangerSection: {
    borderWidth: 1,
    borderColor: '#FFCDD2'
  },
  dangerTitle: {
    color: '#D32F2F'
  },
  dangerItem: {
    borderBottomColor: '#FFCDD2'
  },
  dangerText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '500'
  },
  logoutButtonContainer: {
    padding: 16,
    paddingTop: 8
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#000',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  logoutButtonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16
  },

  // Estilos dos Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  modalDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  modalButtonCancel: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  modalButtonConfirm: {
    backgroundColor: '#000'
  },
  modalButtonDanger: {
    backgroundColor: '#D32F2F'
  },
  modalButtonTextCancel: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16
  },
  modalButtonTextConfirm: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  modalButtonTextDanger: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});
import '../global.css';
import { Slot } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaperProvider>
        <Slot />
      </PaperProvider>
    </SafeAreaView>
  );
}
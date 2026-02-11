import { Ionicons } from '@expo/vector-icons';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

interface Props {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
}

const ACTION_WIDTH = 160;

export function SwipeableEquipmentCard({
  item,
  onEdit,
  onDelete,
}: Props) {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -ACTION_WIDTH);
      }
    })
    .onEnd(() => {
      if (translateX.value < -80) {
        translateX.value = withSpring(-ACTION_WIDTH);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  function confirmDelete() {
    Alert.alert(
      'Excluir equipamento?',
      'Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  }

  const monthly =
    (item.power_watts *
      item.hours_per_day *
      item.days_per_month) /
    1000;

  return (
    <View style={styles.wrapper}>
      {/* AÇÕES POR BAIXO */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.edit]}
          onPress={onEdit}
        >
          <Ionicons name="pencil" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.delete]}
          onPress={confirmDelete}
        >
          <Ionicons name="trash" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* CARD */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>
            {monthly.toFixed(2)} kWh / mês
          </Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },

  actions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    flexDirection: 'row',
  },

  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  edit: {
    backgroundColor: '#3B82F6',
  },

  delete: {
    backgroundColor: '#EF4444',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  name: {
    fontWeight: '700',
    fontSize: 14,
    color: colors.text,
  },

  meta: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});
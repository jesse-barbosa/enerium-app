import { Ionicons } from '@expo/vector-icons';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const ACTION_WIDTH = 160;

interface Props {
  item: any;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SwipeableEnvironmentCard({
  item,
  onPress,
  onEdit,
  onDelete,
}: Props) {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      const newTranslate = event.translationX;

      // Permite deslizar entre 0 e -ACTION_WIDTH
      translateX.value = Math.min(
        0,
        Math.max(-ACTION_WIDTH, newTranslate)
      );
    })
    .onEnd(() => {
      // Se passou da metade, abre
      if (translateX.value < -ACTION_WIDTH / 2) {
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
      'Excluir ambiente?',
      'Todos os equipamentos serão removidos.',
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

  return (
    <View style={styles.wrapper}>
      {/* AÇÕES */}
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
          <View style={styles.iconWrapper}>
            <Ionicons name="cube-outline" size={26} color={colors.primary} />
          </View>
          <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.type} • {item.area_m2} m²
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },

  actions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },

  actionButton: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  edit: {
    backgroundColor: '#3b83f68f',
  },

  delete: {
    backgroundColor: '#ef44449f',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF2E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },

  meta: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
});
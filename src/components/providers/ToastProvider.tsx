import * as React from 'react';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { Toast } from 'react-hot-toast';
import { useToaster } from 'react-hot-toast/src/core/use-toaster';
// eslint-disable-next-line no-restricted-imports
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Text } from '#ui-kit';

import { customAnimateTo } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

const ToastItem = ({
  t,
  updateHeight,
  offset,
}: {
  t: Toast;
  updateHeight: (height: number) => void;
  offset: number;
}) => {
  const fadeAnim = useSharedValue(0.5);
  const posAnim = useSharedValue(-80);
  const colors = useColors();

  useEffect(() => {
    customAnimateTo(fadeAnim, t.visible ? 1 : 0);
  }, [fadeAnim, t.visible]);

  useEffect(() => {
    customAnimateTo(posAnim, t.visible ? -offset : 80);
  }, [posAnim, offset, t.visible]);

  const rWrapperStyles = useAnimatedStyle(() => ({
    zIndex: t.visible ? 9999 : undefined,
    opacity: fadeAnim.value,
    transform: [
      {
        translateY: posAnim.value,
      },
    ],
  }));

  return (
    <Animated.View style={[styles.toastWrapper, rWrapperStyles]}>
      <View
        key={t.id}
        style={[styles.toast, { backgroundColor: colors.black }]}
        onLayout={event => updateHeight(event.nativeEvent.layout.height)}
      >
        <Text>{t.icon} </Text>
        {typeof t.message === 'string' && (
          <Text
            color={colors.white}
            style={styles.toastText}
          >
            {t.message}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const ToastProvider = () => {
  const { toasts, handlers } = useToaster();
  return (
    <View
      pointerEvents="none"
      style={styles.provider}
    >
      {toasts.map(t => (
        <ToastItem
          key={t.id}
          offset={handlers.calculateOffset(t, {
            reverseOrder: false,
          })}
          t={t}
          updateHeight={(height: number) => handlers.updateHeight(t.id, height)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  provider: {
    position: 'absolute',
    right: 0,
    bottom: 100,
    left: 0,
  },
  toastWrapper: {
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 44,
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  toastText: {
    flex: 1,
    padding: 4,
    textAlign: 'center',
  },
});

export default ToastProvider;

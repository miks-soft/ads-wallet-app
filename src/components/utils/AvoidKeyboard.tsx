import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { useKeyboardHandler } from 'react-native-keyboard-controller';
// eslint-disable-next-line no-restricted-imports
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { customAnimateTo, IS_IOS } from '#styles';

export interface IAvoidKeyboard {
  children: ReactNode;
  style: StyleProp<ViewStyle>;
  offset: number;
  mode: 'translate' | 'padding';
}

const AvoidKeyboard: React.FC<Partial<IAvoidKeyboard>> = ({
  children,
  style,
  offset = 0,
  mode = 'translate',
}) => {
  const height = useSharedValue(0);
  const progress = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: e => {
        'worklet';
        const willKeyboardAppear = e.progress === 1;
        if (IS_IOS && mode === 'translate' && willKeyboardAppear) {
          customAnimateTo(progress, e.progress);
        } else {
          progress.value = e.progress;
        }
      },
      onMove: e => {
        'worklet';
        progress.value = e.progress;
        height.value = e.height;
      },
      onEnd: e => {
        'worklet';
        progress.value = e.progress;
        height.value = e.height;
      },
    },
    [],
  );

  const rStyle = useAnimatedStyle(() => {
    const interpolatedValue = interpolate(
      progress.value,
      [0, 1],
      [0, height.value - offset],
    );

    switch (mode) {
      case 'translate':
        return {
          transform: [
            {
              translateY: -interpolatedValue,
            },
          ],
        };
      case 'padding':
        return {
          paddingBottom: interpolatedValue,
        };
    }
  });

  return <Animated.View style={[rStyle, style]}>{children}</Animated.View>;
};
export default AvoidKeyboard;

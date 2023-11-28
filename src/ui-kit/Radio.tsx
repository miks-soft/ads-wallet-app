import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

// eslint-disable-next-line no-restricted-imports
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { customAnimateTo } from '#styles';
import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

export interface IRadio {
  onChange: () => void;
  value: boolean;
  disabled: boolean;
  containerStyle: StyleProp<ViewStyle>;
  overrideColors: RadioColorScheme;
}

const Radio: React.FC<Partial<IRadio>> = ({
  value = false,
  onChange,
  disabled = false,
  containerStyle = {},
  overrideColors,
}) => {
  const colorScheme = useComponentsColors('Radio', overrideColors);
  const styles = getStyles(disabled, colorScheme);
  const toggleProgress = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => ({
    opacity: toggleProgress.value,
  }));

  useEffect(() => {
    customAnimateTo(toggleProgress, value ? 1 : 0);
  }, [value]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || !onChange}
      style={[styles.box, containerStyle]}
      onPress={onChange}
    >
      <Animated.View style={[styles.iconContainer, rStyle]} />
    </TouchableOpacity>
  );
};

export const getRadioColorScheme = (colors: Colors) => ({
  borderColor: colors.black,
  backgroundColor: colors.white,
  activeContainerBackgroundColor: colors.primary.normal,
});

type RadioColorScheme = ReturnType<typeof getRadioColorScheme>;

const getStyles = (disable: boolean, colorScheme: RadioColorScheme) =>
  StyleSheet.create({
    box: {
      width: 20,
      aspectRatio: 1,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disable ? 0.25 : 1,
      borderWidth: 1,
      borderColor: colorScheme.borderColor,
      borderRadius: 10,
      backgroundColor: colorScheme.backgroundColor,
    },
    iconContainer: {
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: colorScheme.activeContainerBackgroundColor,
    },
  });

export default React.memo(Radio);

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

import Icon from './Icon';

export interface ICheckbox {
  onChange: () => void;
  value: boolean;
  disabled: boolean;
  containerStyle: StyleProp<ViewStyle>;
  overrideColors: CheckboxColorScheme;
}

const Checkbox: React.FC<Partial<ICheckbox>> = ({
  value = false,
  onChange,
  disabled = false,
  containerStyle = {},
  overrideColors,
}) => {
  const colorScheme = useComponentsColors('Checkbox', overrideColors);
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
      <Animated.View style={[styles.iconContainer, rStyle]}>
        <Icon
          color={colorScheme.iconColor}
          name="check"
          size={20}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export const getCheckboxColorScheme = (colors: Colors) => ({
  borderColor: colors.black,
  backgroundColor: colors.white,
  iconContainerBackgroundColor: colors.primary.normal,
  iconColor: colors.white,
});

type CheckboxColorScheme = ReturnType<typeof getCheckboxColorScheme>;

const getStyles = (disable: boolean, colorScheme: CheckboxColorScheme) =>
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
      borderRadius: 4,
      backgroundColor: colorScheme.backgroundColor,
    },
    iconContainer: {
      backgroundColor: colorScheme.iconContainerBackgroundColor,
    },
  });

export default React.memo(Checkbox);

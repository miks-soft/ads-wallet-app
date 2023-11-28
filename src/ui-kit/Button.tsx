/* eslint-disable react-native/no-unused-styles */
import React, { FC, ReactNode } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

import Text from './Text';

export interface IButton {
  type: 'primary' | 'secondary';
  size: 'default' | 'small' | 'extra-small';
  fullwidth: boolean;
  isLoading: boolean;
  disabled: boolean;
  onPress: () => void;
  onLongPress: () => void;
  children: text | ReactNode;
  style: StyleProp<ViewStyle>;
  overrideColors: ButtonColorScheme;
}

const Button: FC<Partial<IButton>> = ({
  children = 'Button',
  type = 'primary',
  size = 'default',
  fullwidth = true,
  isLoading = false,
  disabled = false,
  style = {},
  overrideColors,
  onPress = () => {},
  onLongPress = () => {},
}) => {
  const colorScheme = useComponentsColors('Button', overrideColors);
  const styles = getStyles({ size, fullwidth, disabled, colorScheme });

  const content =
    typeof children === 'string' ? (
      <Text
        color={styles[type].color}
        weight={styles[type].weight}
      >
        {children}
      </Text>
    ) : (
      children
    );

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      style={[styles.container, styles[type], StyleSheet.flatten(style)]}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator
          color={styles[type].color}
          style={styles.activityIndicator}
        />
      ) : (
        content
      )}
    </TouchableOpacity>
  );
};

const minHeightMap = {
  'extra-small': 34,
  small: 42,
  default: 50,
};

const paddingMap = {
  'extra-small': 8,
  small: 12,
  default: 16,
};

export const getButtonColorScheme = (colors: Colors) => ({
  primary: {
    text: colors.white,
    textDisabled: colors.white,
    borderColor: colors.primary.normal,
    borderColorDisabled: colors.primary.pale,
    background: colors.primary.normal,
    backgroundDisabled: colors.primary.pale,
  },
  secondary: {
    text: colors.primary.normal,
    textDisabled: colors.primary.pale,
    borderColor: colors.primary.normal,
    borderColorDisabled: colors.primary.pale,
    background: colors.white,
    backgroundDisabled: colors.white,
  },
});

type ButtonColorScheme = ReturnType<typeof getButtonColorScheme>;

const getStyles = ({
  size,
  fullwidth,
  disabled,
  colorScheme,
}: Pick<IButton, 'size' | 'fullwidth' | 'disabled'> & {
  colorScheme: ButtonColorScheme;
}) =>
  StyleSheet.create({
    container: {
      width: fullwidth ? '100%' : 'auto',
      minHeight: minHeightMap[size],
      justifyContent: 'center',
      alignItems: 'center',
      padding: paddingMap[size],
      borderWidth: 1,
      borderRadius: 6,
    },
    activityIndicator: {
      minHeight: 24,
    },
    primary: {
      color: colorScheme.primary.text,
      weight: '700' as const,
      borderColor: !disabled
        ? colorScheme.primary.borderColor
        : colorScheme.primary.borderColorDisabled,
      backgroundColor: !disabled
        ? colorScheme.primary.background
        : colorScheme.primary.backgroundDisabled,
    },
    secondary: {
      color: !disabled
        ? colorScheme.secondary.text
        : colorScheme.secondary.textDisabled,
      weight: '400' as const,
      borderColor: !disabled
        ? colorScheme.secondary.borderColor
        : colorScheme.secondary.borderColorDisabled,
      backgroundColor: colorScheme.secondary.background,
    },
  });

export default React.memo(Button);

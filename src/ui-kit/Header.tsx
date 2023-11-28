import React, { ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { hitSlop } from '#styles';
import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

import Icon, { IconNames } from './Icon';
import Text, { H4 } from './Text';

export interface IHeader {
  title: text;
  subtitle: text;
  titleSize: number;
  transparent: boolean;
  leftIconName: IconNames;
  rightIconName: IconNames;
  leftIcon: ReactNode;
  rightIcon: ReactNode;
  hideLeftIcon: boolean;
  hideRightIcon: boolean;
  leftIconText: text;
  rightIconText: text;
  leftIconDisabled: boolean;
  rightIconDisabled: boolean;
  onPressRight: () => void;
  onPressLeft: () => void;
  paddingHorizontal: number;
  containerStyle: StyleProp<ViewStyle>;
  overrideColors: HeaderColorScheme;
}

const Header: React.FC<Partial<IHeader>> = ({
  title = '',
  subtitle = '',
  titleSize = 20,
  leftIconName = 'chevron-left-marginless',
  rightIconName = 'chevron-right-marginless',
  leftIcon = null,
  rightIcon = null,
  hideLeftIcon = false,
  hideRightIcon = false,
  leftIconText = '',
  rightIconText = '',
  leftIconDisabled = false,
  rightIconDisabled = false,
  onPressRight = () => {},
  onPressLeft = () => {},
  paddingHorizontal = 16,
  containerStyle,
  overrideColors,
}) => {
  const colorScheme = useComponentsColors('Header', overrideColors);
  const insets = useSafeAreaInsets();

  const styles = getStyles({
    paddingTop: insets.top,
    paddingHorizontal,
    hideLeftIcon,
    hideRightIcon,
    colorScheme,
  });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            disabled={!onPressLeft || leftIconDisabled || hideLeftIcon}
            hitSlop={hitSlop}
            style={styles.leftSide}
            onPress={onPressLeft}
          >
            {leftIconText && <Text>{leftIconText}</Text>}
            {leftIcon}
            {!leftIcon && leftIconName !== 'chevron-left-marginless' && (
              <Icon
                color={colorScheme.icons}
                name={leftIconName}
                size={24}
                style={styles.iconLeft}
              />
            )}
            {!leftIcon && leftIconName === 'chevron-left-marginless' && (
              <Icon
                color={colorScheme.icons}
                name={leftIconName}
                size={10}
                style={[styles.iconLeft, styles.chevron]}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.centerSide}>
          <Text
            size={titleSize}
            weight="700"
          >
            {title}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity
            disabled={!onPressRight || rightIconDisabled || hideRightIcon}
            hitSlop={hitSlop}
            style={styles.rightSide}
            onPress={onPressRight}
          >
            {rightIconText && <Text>{rightIconText}</Text>}
            {rightIcon}
            {!rightIcon && rightIconName !== 'chevron-right-marginless' && (
              <Icon
                color={colorScheme.icons}
                name={rightIconName}
                size={24}
                style={styles.iconRight}
              />
            )}
            {!rightIcon && rightIconName === 'chevron-right-marginless' && (
              <Icon
                color={colorScheme.icons}
                name={rightIconName}
                size={10}
                style={[styles.iconRight, styles.chevron]}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {subtitle && (
        <View style={styles.subtitle}>
          <H4>{subtitle}</H4>
        </View>
      )}
    </View>
  );
};

export const getHeaderColorScheme = (colors: Colors) => ({
  background: colors.transparent,
  icons: colors.black,
});

type HeaderColorScheme = ReturnType<typeof getHeaderColorScheme>;

const getStyles = ({
  paddingTop,
  paddingHorizontal,
  hideLeftIcon,
  hideRightIcon,
  colorScheme,
}: {
  paddingHorizontal: number;
  hideLeftIcon: boolean;
  hideRightIcon: boolean;
  paddingTop: number;
  colorScheme: HeaderColorScheme;
}) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: paddingTop + 8,
      paddingBottom: 8,
      paddingHorizontal: paddingHorizontal,
      backgroundColor: colorScheme.background,
    },
    subtitle: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      top: -8,
    },
    wrapper: {
      flexDirection: 'column',
    },
    iconContainer: {
      flex: 1.5,
      alignItems: 'center',
    },
    leftSide: {
      flexDirection: 'row',
      marginRight: 'auto',
      opacity: hideLeftIcon ? 0 : 1,
    },
    iconLeft: {
      marginRight: 8,
    },
    rightSide: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginLeft: 'auto',
      opacity: hideRightIcon ? 0 : 1,
    },
    iconRight: {
      marginLeft: 8,
    },
    chevron: {
      aspectRatio: 23.34 / 39.96,
    },
    centerSide: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default React.memo(Header);

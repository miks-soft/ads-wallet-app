import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text, Icon } from '#ui-kit';
import { IconNames } from '#ui-kit/Icon';
import { H5 } from '#ui-kit/Text';

import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

export type Tab = {
  iconName: IconNames;
  onPress: () => void;
  label: string;
  screenName: string;
  amount?: number;
  overrideColors?: BottomTabColorScheme;
};

type IBottomTab = Tab & {
  isFocus: boolean;
};

const BottomTab: React.FC<Partial<IBottomTab>> = ({
  label = '',
  iconName,
  isFocus = false,
  amount = 0,
  onPress = () => {},
  overrideColors,
}) => {
  const colorScheme = useComponentsColors('BottomTab', overrideColors);
  const styles = getStyles(colorScheme);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.iconWrapper}>
        <Icon
          color={isFocus ? colorScheme.focusedTabIcon : colorScheme.tabIcon}
          name={iconName}
        />
        {!!amount && (
          <View style={styles.amountIndicator}>
            <H5
              color={colorScheme.amountText}
              size={10}
            >
              {amount > 9 ? '9+' : amount}
            </H5>
          </View>
        )}
      </View>
      <Text
        color={isFocus ? colorScheme.focusedTabText : colorScheme.tabText}
        lineHeight={12}
        size={10}
        style={styles.label}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const getBottomTabColorScheme = (colors: Colors) => ({
  focusedTabIcon: colors.primary.normal,
  focusedTabText: colors.black,
  tabIcon: colors.grayscale.__3,
  tabText: colors.grayscale.__3,
  amountText: colors.grayscale.__7,
  amountBackground: colors.primary.normal,
});

type BottomTabColorScheme = ReturnType<typeof getBottomTabColorScheme>;

const getStyles = (colorScheme: BottomTabColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      marginTop: 4,
    },
    amountIndicator: {
      height: 16,
      width: 16,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: -4,
      right: -4,
      borderRadius: 10,
      backgroundColor: colorScheme.amountBackground,
    },
  });

export default BottomTab;

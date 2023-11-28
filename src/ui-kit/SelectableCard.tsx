import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Text, Icon } from '#ui-kit';
import { IconNames } from '#ui-kit/Icon';
import { H3 } from '#ui-kit/Text';

import { shadow } from '#styles';
import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

type ISelectableCard = {
  iconName: IconNames;
  onPress: () => void;
  title: string;
  subtitle: string;
  isActive: boolean;
  isSubtitleFirst: boolean;
  containerStyle: StyleProp<ViewStyle>;
  overrideColors: SelectableCardColorScheme;
};

const SelectableCard: React.FC<Partial<ISelectableCard>> = ({
  title = '',
  subtitle = '',
  isSubtitleFirst = false,
  iconName = 'wallet',
  onPress = () => {},
  isActive = false,
  containerStyle,
  overrideColors,
}) => {
  const colorScheme = useComponentsColors('SelectableCard', overrideColors);
  const styles = getStyles(colorScheme);
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: isActive ? colorScheme.outline : colorScheme.background,
        },
        shadow.style,
        containerStyle,
      ]}
      onPress={onPress}
    >
      {isActive && (
        <View style={styles.checkMarkContainer}>
          <Icon
            color={colorScheme.checkMark}
            name="check"
            size={16}
          />
        </View>
      )}
      <Icon
        color={colorScheme.icon}
        name={iconName}
        size={48}
        style={styles.icon}
      />
      <View>
        {isSubtitleFirst && subtitle && <Text>{subtitle}</Text>}
        {title && <H3>{title}</H3>}
        {!isSubtitleFirst && subtitle && <Text>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export const getSelectableCardColorScheme = (colors: Colors) => ({
  outline: colors.primary.normal,
  background: colors.white,
  checkMarkContainer: colors.primary.normal,
  checkMark: colors.white,
  icon: colors.primary.normal,
});

type SelectableCardColorScheme = ReturnType<
  typeof getSelectableCardColorScheme
>;

const getStyles = (colorScheme: SelectableCardColorScheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: colorScheme.background,
    },
    icon: {
      marginRight: 12,
    },
    checkMarkContainer: {
      width: 20,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 8,
      right: 8,
      borderRadius: 16,
      backgroundColor: colorScheme.checkMarkContainer,
    },
  });

export default SelectableCard;

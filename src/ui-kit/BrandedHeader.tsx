import React, { ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useSelector } from '#hooks/redux';

import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, Icon } from '#ui-kit';
import { IconNames } from '#ui-kit/Icon';

import { REGIONS } from '#config';
import { LOGO_MAP } from '#config/images';

import { hitSlop, shadow } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

export interface IBrandedHeader {
  title: text;
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
}

const BrandedHeader: React.FC<Partial<IBrandedHeader>> = ({
  leftIconName = 'bars',
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
}) => {
  const colors = useColors();
  const region = useSelector(store => store.app.region);

  const insets = useSafeAreaInsets();

  const styles = getStyles({
    paddingTop: insets.top,
    paddingHorizontal,
    hideLeftIcon,
    hideRightIcon,
    colors,
    region,
  });

  return (
    <View style={[styles.container, shadow.style, containerStyle]}>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          disabled={!onPressLeft || leftIconDisabled || hideLeftIcon}
          hitSlop={hitSlop}
          style={styles.leftSide}
          onPress={onPressLeft}
        >
          {leftIcon ? (
            leftIcon
          ) : (
            <Icon
              color={colors.black}
              name={leftIconName}
              size={24}
              style={styles.iconLeft}
            />
          )}
          {leftIconText && <Text>{leftIconText}</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.centerSide}>
        <FastImage
          source={LOGO_MAP[region]}
          style={styles.logo}
        />
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          disabled={!onPressRight || rightIconDisabled || hideRightIcon}
          hitSlop={hitSlop}
          style={styles.rightSide}
          onPress={onPressRight}
        >
          {rightIconText && <Text>{rightIconText}</Text>}
          {rightIcon ? rightIcon : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = ({
  paddingTop,
  paddingHorizontal,
  hideLeftIcon,
  hideRightIcon,
  colors,
  region,
}: {
  paddingHorizontal: number;
  hideLeftIcon: boolean;
  hideRightIcon: boolean;
  paddingTop: number;
  colors: Colors;
  region: REGIONS;
}) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 2,
      paddingTop: paddingTop + 8,
      paddingBottom: 20,
      paddingHorizontal: paddingHorizontal,
      backgroundColor: colors.white,
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
    logo: {
      width: 102,
      aspectRatio: region === 'USA' ? 150 / 60 : 154 / 32,
    },
    centerSide: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default BrandedHeader;

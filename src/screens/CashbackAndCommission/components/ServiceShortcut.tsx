import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import FastImage from 'react-native-fast-image';

import {
  ImplementedAdvertisingServices,
  MapImplementedAdvertisingServicesLogo,
} from '#config/enums';

import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

interface IServiceShortcut {
  onPress?: () => void;
  isActive: boolean;
  service: ImplementedAdvertisingServices;
  containerStyle?: StyleProp<ViewStyle>;
}

const ServiceShortcut: React.FC<IServiceShortcut> = ({
  service,
  containerStyle,
  isActive = false,
  onPress = () => {},
}) => {
  const colors = useColors();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.wrapper, containerStyle]}
      onPress={onPress}
    >
      <View style={[styles.container, isActive ? styles.active : {}]}>
        <FastImage
          source={MapImplementedAdvertisingServicesLogo[service]}
          style={styles.image}
        />
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    image: {
      width: '45%',
      aspectRatio: 1,
    },
    wrapper: {
      borderWidth: 1,
      borderColor: colors.grayscale.__5,
      borderRadius: 12,
      backgroundColor: colors.grayscale.__55,
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 4,
      borderRadius: 12,
      backgroundColor: colors.grayscale.__55,
    },
    active: {
      borderColor: colors.primary.pale,
      backgroundColor: colors.white,
    },
  });

export default ServiceShortcut;

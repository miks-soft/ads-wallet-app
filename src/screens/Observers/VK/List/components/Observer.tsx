import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import FastImage from 'react-native-fast-image';

import { Icon, Text } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { STRINGS } from '#localization';

import { MapAllAdvertisingServicesColor } from '#config/enums';
import Images from '#config/images';

import { shadow } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOObserver } from '#generated/types';

import ObserversClient from '../../../components/ObserversClient';

interface IObserver {
  item: DTOObserver;
  onEdit?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const Observer: React.FC<IObserver> = ({ containerStyle, item, onEdit }) => {
  const colors = useColors();
  const styles = getStyles(colors);
  return (
    <View style={[styles.container, shadow.style, containerStyle]}>
      <FastImage
        source={Images.VKLogo}
        style={styles.logo}
        tintColor={colors.white}
      />

      <TouchableOpacity
        disabled={!onEdit}
        onPress={onEdit}
      >
        <View style={styles.titleWrapper}>
          <Text color={colors.white}>{STRINGS.COMPONENT_OBSERVER.user}</Text>
          {onEdit && (
            <Icon
              color={colors.white}
              name="pencil"
              size={20}
            />
          )}
        </View>
        <H2 color={colors.white}>
          {item.first_name} {item.last_name}
        </H2>
      </TouchableOpacity>

      <Text color={colors.white}>{STRINGS.COMPONENT_OBSERVER.subusers}</Text>
      <View style={styles.clients}>
        {!!item.clients.length &&
          item.clients.map(client => (
            <ObserversClient
              key={client.id}
              item={client}
            />
          ))}
      </View>
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    titleWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    logo: {
      width: 64,
      aspectRatio: 1,
      position: 'absolute',
      top: 4,
      right: 16,
      opacity: 0.9,
    },
    clients: {
      marginTop: 4,
      gap: 8,
    },
    container: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: 16,
      paddingTop: 12,
      paddingBottom: 12,
      borderWidth: 1,
      borderColor: colors.grayscale.__5,
      borderRadius: 12,
      backgroundColor: MapAllAdvertisingServicesColor.vkontakte,
    },
  });

export default Observer;

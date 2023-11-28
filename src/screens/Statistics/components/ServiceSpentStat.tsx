import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { useSelector } from '#hooks/redux';

import Text, { H4 } from '#ui-kit/Text';

import { ENUMS, STRINGS } from '#localization';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import {
  AllAdvertisingServices,
  CurrencyMap,
  MapAllAdvertisingServicesColor,
} from '#config/enums';

import { useColors } from '#styles/theme/ColorsContext';

const ServiceSpentStat: React.FC<{
  service: AllAdvertisingServices;
  amount?: number | string;
  containerStyle?: StyleProp<ViewStyle>;
  isNoDataAvailable: boolean;
}> = ({ containerStyle, service, amount, isNoDataAvailable }) => {
  const colors = useColors();
  const region = useSelector(store => store.app.region);

  const MapAllAdvertisingServicesColorGray: {
    [key in AllAdvertisingServices]: string;
  } = {
    [AllAdvertisingServices.VK]: colors.grayscale.__1,
    [AllAdvertisingServices.Yandex]: colors.grayscale.__55,
    [AllAdvertisingServices.MyTarget]: colors.grayscale.__3,
    [AllAdvertisingServices.Google]: colors.grayscale.__2,
    [AllAdvertisingServices.VKAds]: colors.grayscale.__4,
  };

  const styles = getStyles(
    !isNoDataAvailable
      ? MapAllAdvertisingServicesColor[service]
      : MapAllAdvertisingServicesColorGray[service],
  );

  return (
    <View style={[styles.amounts, containerStyle]}>
      <View style={styles.serviceColor} />
      {!isNoDataAvailable && (
        <H4 style={styles.title}>{ENUMS.Services[service]}</H4>
      )}
      <Text weight="500">
        {!isNoDataAvailable
          ? `${NumberFormatter.format(amount || '0')} ${
              CurrencyMap[APP_CURRENCY_MAP[region]]
            }`
          : STRINGS.SHARED.no_data}
      </Text>
    </View>
  );
};

const getStyles = (color: string) =>
  StyleSheet.create({
    title: {
      flex: 1,
    },
    serviceColor: {
      width: 8,
      aspectRatio: 1,
      marginRight: 8,
      borderRadius: 4,
      backgroundColor: color,
    },
    amounts: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
  });

export default React.memo(ServiceSpentStat);

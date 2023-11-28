import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { useSelector } from '#hooks/redux';

import FastImage from 'react-native-fast-image';

import { H3, H4, H5 } from '#ui-kit/Text';

import DateFormatter from '#services/formatters/Date';
import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import { CurrencyMap } from '#config/enums';

import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOTransaction } from '#generated/types';

import { MapEventIdTypesIcon, MapBEEventFEEventIdType } from '../types';

const Transaction: React.FC<
  Partial<{
    containerStyle: StyleProp<ViewStyle>;
    item: DTOTransaction;
  }>
> = ({ containerStyle, item }) => {
  const colors = useColors();
  const styles = getStyles(colors);
  const region = useSelector(store => store.app.region);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <FastImage
        source={
          MapEventIdTypesIcon[
            MapBEEventFEEventIdType[
              item?.type as keyof typeof MapBEEventFEEventIdType
            ]
          ]
        }
        style={styles.image}
      />
      <View style={styles.data}>
        <View style={styles.headLine}>
          <H3>{item?.name}</H3>
          <H4>{DateFormatter.humanize(item?.date)}</H4>
        </View>
        <H4 weight="500">
          {NumberFormatter.format(item?.amountTotal || '0')}{' '}
          {CurrencyMap[APP_CURRENCY_MAP[region]]}
        </H4>
        <H5>{item?.desc}</H5>
      </View>
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 16,
      borderRadius: 8,
    },
    headLine: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    data: {
      flex: 1,
      gap: 4,
    },
    image: {
      width: 40,
      aspectRatio: 1,
      borderRadius: 20,
      backgroundColor: colors.grayscale.__4,
    },
  });

export default React.memo(Transaction);

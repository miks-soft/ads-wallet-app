import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

import { useSelector } from '#hooks/redux';

import FastImage, { FastImageProps } from 'react-native-fast-image';

import { Icon } from '#ui-kit';
import Text from '#ui-kit/Text';

import { STRINGS } from '#localization';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import { CurrencyMap } from '#config/enums';

const CategoryStats: React.FC<
  Partial<{
    image: FastImageProps['source'];
    categoryName: string;
    amount: number | string;
    isNoDataAvailable: boolean;
    containerStyle: StyleProp<ViewStyle>;
    onPress: () => void;
  }>
> = ({
  containerStyle,
  image,
  categoryName,
  amount,
  isNoDataAvailable,
  onPress,
}) => {
  const region = useSelector(store => store.app.region);

  return (
    <TouchableOpacity
      disabled={!onPress || !amount}
      style={[styles.amounts, containerStyle]}
      onPress={onPress}
    >
      <View style={styles.category}>
        <FastImage
          source={image}
          style={styles.image}
        />
        <Text>{categoryName}</Text>
      </View>
      <View style={styles.amount}>
        <Text weight="500">
          {!isNoDataAvailable
            ? `${NumberFormatter.format(amount || '0')} ${
                CurrencyMap[APP_CURRENCY_MAP[region]]
              }`
            : STRINGS.SCREEN_STATISTICS.noData}
        </Text>
        {!!amount && <Icon name="chevron-bottom" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  amounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  image: {
    width: 36,
    aspectRatio: 1,
    marginRight: 8,
  },
});

export default React.memo(CategoryStats);

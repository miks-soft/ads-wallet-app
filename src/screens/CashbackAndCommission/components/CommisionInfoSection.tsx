import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, FlatList } from 'react-native';

import { useSelector } from '#hooks/redux';

import { Text } from '#ui-kit';
import { H2, H3 } from '#ui-kit/Text';

import { STRINGS } from '#localization';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import { CurrencyMap } from '#config/enums';

import { shadow } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOConditionRange } from '#generated/types';

interface ICommisionInfoSection {
  title: string;
  amount: string;
  containerStyle?: StyleProp<ViewStyle>;
  ranges?: DTOConditionRange[] | number;
}

const checkConditionsNotEmpty = (platformRanges: DTOConditionRange[]) => {
  return !!platformRanges.find(el => {
    return +el.percent !== 0;
  });
};

const CommisionInfoSection: React.FC<ICommisionInfoSection> = ({
  containerStyle,
  title,
  amount,
  ranges,
}) => {
  const colors = useColors();
  const styles = getStyles(colors);
  const region = useSelector(store => store.app.region);
  if (
    ranges === undefined ||
    typeof ranges === 'number' ||
    !checkConditionsNotEmpty(ranges)
  ) {
    return null;
  }

  return (
    <View style={[styles.container, shadow.style, containerStyle]}>
      <H2 style={styles.title}>{title}</H2>
      <View style={styles.total}>
        <Text weight="300">
          <H2>
            {NumberFormatter.formatByCurrency(
              amount || '0',
              APP_CURRENCY_MAP[region],
            )}{' '}
            {CurrencyMap[APP_CURRENCY_MAP[region]]}
          </H2>{' '}
          {STRINGS.SCREEN_CASHBACK_AND_COMMISSION.withdrawsCurrentMonth}
        </Text>
      </View>
      <FlatList
        data={ranges}
        disableVirtualization={true}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        renderItem={({ item }) => (
          <View style={styles.range}>
            <Text>
              {NumberFormatter.format(item.min)}{' '}
              {CurrencyMap[APP_CURRENCY_MAP[region]]} –{' '}
              {NumberFormatter.format(item.max)}{' '}
              {CurrencyMap[APP_CURRENCY_MAP[region]]}
            </Text>
            <Text>
              <H3>{item.percent}</H3> %
            </Text>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    title: {
      marginBottom: 4,
    },
    range: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    divider: {
      height: 0.5,
      width: '100%',
      marginVertical: 4,
    },
    total: {
      marginBottom: 8,
    },
    container: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.error.lightest,
    },
  });

export default CommisionInfoSection;

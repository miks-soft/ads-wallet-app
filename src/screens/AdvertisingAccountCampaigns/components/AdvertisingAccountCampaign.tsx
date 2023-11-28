import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useSelector } from '#hooks/redux';

import { Text, Icon } from '#ui-kit';
import { H4 } from '#ui-kit/Text';

import { STRINGS } from '#localization';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import { CurrencyMap } from '#config/enums';

import { shadow } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOAdvertAccountCampaign } from '#generated/types';

const AdvertisingAccountCampaign: React.FC<
  Partial<{
    containerStyle: StyleProp<ViewStyle>;
    item: DTOAdvertAccountCampaign;
    onPressPriceChange: () => void;
    withActions: boolean;
  }>
> = ({ containerStyle, item, onPressPriceChange }) => {
  const colors = useColors();
  const t = STRINGS.COMPONENT_ADVERTISING_ACCOUNT_CAMPAIGN;
  const region = useSelector(store => store.app.region);
  return (
    <View
      style={[
        styles.campaignCard,
        { backgroundColor: colors.white },
        shadow.style,
        containerStyle,
      ]}
    >
      <TouchableOpacity
        style={styles.action}
        onPress={onPressPriceChange}
      >
        <Icon
          color={colors.black}
          name="price-change"
        />
      </TouchableOpacity>

      <Text
        style={styles.title}
        weight="500"
      >
        {item?.name}
      </Text>

      <View style={styles.columns}>
        <View style={styles.column}>
          <H4>{t.totalLimit} </H4>
          <Text weight="500">
            {NumberFormatter.formatByCurrency(
              item?.total_limit || '0',
              CurrencyMap[APP_CURRENCY_MAP[region]],
            )}{' '}
            {CurrencyMap[APP_CURRENCY_MAP[region]]}
          </Text>
        </View>

        <View style={styles.column}>
          <H4>{t.spent} </H4>
          <Text weight="500">
            {NumberFormatter.formatByCurrency(
              item?.spent || '0',
              CurrencyMap[APP_CURRENCY_MAP[region]],
            )}{' '}
            {CurrencyMap[APP_CURRENCY_MAP[region]]}
          </Text>
        </View>

        <View style={styles.column}>
          <H4>{t.clicks} </H4>
          <Text weight="500">{item?.click || '0'}</Text>
        </View>

        <View style={styles.column}>
          <H4>{t.forecast} </H4>
          <Text weight="500">{item?.click || '0'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  action: {
    position: 'absolute',
    zIndex: 2,
    top: 16,
    right: 18,
  },
  campaignCard: {
    padding: 16,
    gap: 8,
    borderRadius: 8,
  },
  columns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
  },
  column: {
    width: '50%',
  },
  title: {
    paddingRight: 30,
  },
});

export default React.memo(AdvertisingAccountCampaign);

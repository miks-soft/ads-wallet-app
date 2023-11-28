import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useSelector } from '#hooks/redux';

import { Checkbox, FieldError, Text, TextInput } from '#ui-kit';
import { H3, H4 } from '#ui-kit/Text';

import { STRINGS } from '#localization';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import { CurrencyMap } from '#config/enums';

import { useColors } from '#styles/theme/ColorsContext';

import { DTOAdvertAccountCampaign } from '#generated/types';

interface IAdvertisingAccountCampaign {
  item: DTOAdvertAccountCampaign;
  amount?: string;
  error?: string;
  selected?: boolean;
  onSelect: (old: boolean) => void;
  onChangeAmount: (value: string) => void;
}

const DepositAdvertisingAccountCampaign: React.FC<
  IAdvertisingAccountCampaign
> = ({ item, selected = false, amount, error, onChangeAmount, onSelect }) => {
  const colors = useColors();
  const region = useSelector(store => store.app.region);
  const t = STRINGS.COMPONENT_DEPOSIT_ADVERTISING_ACCOUNT_CAMPAIGN;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkboxSection}
        onPress={() => onSelect(selected)}
      >
        <Checkbox
          containerStyle={styles.checkbox}
          value={selected}
        />
        <View style={styles.wrapFix}>
          <Text
            color={colors.black}
            style={styles.wrapFix}
          >
            {item.name}
          </Text>
          <H4 color={colors.grayscale.__1}>{item.id}</H4>
        </View>
      </TouchableOpacity>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text color={colors.grayscale.__1}>{t.balance}</Text>
          <Text>
            {NumberFormatter.format(item.total_limit)}{' '}
            {CurrencyMap[APP_CURRENCY_MAP[region]]}
          </Text>
        </View>
        <View style={styles.column}>
          <TextInput
            blurOnSubmit={true}
            IconRight={<H3>{CurrencyMap[APP_CURRENCY_MAP[region]]}</H3>}
            label={t.amount}
            size="small"
            value={amount || ''}
            onChange={onChangeAmount}
          />
        </View>
      </View>
      <FieldError>{error}</FieldError>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  checkbox: {
    marginRight: 8,
  },
  wrapFix: {
    flex: 1,
  },
  checkboxSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    width: '50%',
  },
});

export default React.memo(DepositAdvertisingAccountCampaign);

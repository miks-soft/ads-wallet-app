import React from 'react';
import { StyleSheet } from 'react-native';

import { useSelector } from '#hooks/redux';

import { Button, FieldError, Text, TextInput } from '#ui-kit';
import { H2, H3 } from '#ui-kit/Text';

import { ModalWrapper } from '#components';

import { STRINGS } from '#localization';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import { CurrencyMap } from '#config/enums';

import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const t = STRINGS.MODAL_EDIT_ADVERTISING_CAMPAIGN_LIMIT;
  const region = useSelector(store => store.app.region);
  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2 style={styles.title}>{t.title}</H2>

      <Text color={colors.grayscale.__2}>{t.selectedCampaignLabel}</Text>
      <Text style={styles.description}>{props.account.name}</Text>
      <Text style={styles.description}>{props.account.id}</Text>

      <Text color={colors.grayscale.__2}>{t.serviceLabel}</Text>
      <Text style={styles.description}>{props.route.params.service}</Text>

      <Text color={colors.grayscale.__2}>{t.spent}</Text>
      <Text style={styles.description}>
        {NumberFormatter.formatFloat(props.account.spent)}{' '}
        {CurrencyMap[APP_CURRENCY_MAP[region]]}
      </Text>

      <Text color={colors.grayscale.__2}>{t.currentTotalLimit}</Text>
      <Text style={styles.description}>
        {NumberFormatter.formatFloat(props.account.total_limit)}{' '}
        {CurrencyMap[APP_CURRENCY_MAP[region]]}
      </Text>

      <TextInput
        IconRight={<H3>{CurrencyMap[APP_CURRENCY_MAP[region]]}</H3>}
        keyboardType="number-pad"
        label={t.newLimitInputLabel}
        value={props.amount}
        onChange={props.setAmount}
        onSubmitEditing={props.onChangeLimit}
      />

      <FieldError style={styles.error}>{props.errorAmount}</FieldError>

      <Button
        isLoading={props.isLoading}
        style={styles.button}
        onPress={props.onChangeLimit}
      >
        {t.action}
      </Button>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
    marginBottom: 8,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    marginBottom: 12,
  },
  description: {
    marginBottom: 8,
  },
});

export default Layout;

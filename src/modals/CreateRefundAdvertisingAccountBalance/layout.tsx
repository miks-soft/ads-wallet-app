import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useSelector } from '#hooks/redux';

import { Button, Checkbox, FieldError, TextInput } from '#ui-kit';
import { H2, H3, H4 } from '#ui-kit/Text';

import { ModalWrapper } from '#components';

import { STRINGS } from '#localization';

import { APP_CURRENCY_MAP } from '#config';
import { CurrencyMap } from '#config/enums';

import { modalSafeZone } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.MODAL_REFUND_ADVERTISING_ACCOUNT_BALANCE;
  const region = useSelector(store => store.app.region);

  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2 style={styles.title}>{t.title}</H2>

      <TextInput
        containerStyle={styles.inputContainer}
        disabled={props.shouldTransferAll}
        IconRight={<H3>{CurrencyMap[APP_CURRENCY_MAP[region]]}</H3>}
        keyboardType="number-pad"
        label={t.amountInputLabel}
        placeholder={`${STRINGS.formatString(t.maxAmount, props.maxAmount)}`}
        value={props.shouldTransferAll ? props.maxAmount : props.amount}
        onBlur={() => props.validateAmount()}
        onChange={props.setAmount}
        onSubmitEditing={props.onRefund}
      />

      <FieldError style={styles.error}>{props.errorAmount}</FieldError>

      <TouchableOpacity
        style={styles.conditionWithCheckbox}
        onPress={() => {
          props.setShouldTransferAll(old => !old);
        }}
      >
        <Checkbox value={props.shouldTransferAll} />
        <H4 style={styles.checkboxLabel}>{t.transferAllCheckboxLabel}</H4>
      </TouchableOpacity>

      <Button
        disabled={!props.shouldTransferAll && !props.amount}
        isLoading={props.isLoading}
        style={modalSafeZone.style}
        onPress={props.onRefund}
      >
        {t.action}
      </Button>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  conditionWithCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
});

export default Layout;

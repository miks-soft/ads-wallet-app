import React from 'react';
import { StyleSheet } from 'react-native';

import { Button, FieldError, Header, MaskedInput, TextInput } from '#ui-kit';
import SelectableCard from '#ui-kit/SelectableCard';
import { H3, H5 } from '#ui-kit/Text';

import { FormScrollingContainer, ListExtender } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import CurrencyFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP, RUSSIAN_PHONE_MASK } from '#config';
import { CurrencyMap } from '#config/enums';

import { SAFE_ZONE_BOTTOM } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <>
      <Header
        hideRightIcon={true}
        paddingHorizontal={16}
        title="Пополнение баланса"
        onPressLeft={props.navigation.goBack}
      />

      <FormScrollingContainer
        extraHeight={100}
        style={styles.container}
      >
        <H3 style={styles.title}>1. Как пополнить</H3>

        <SelectableCard
          containerStyle={styles.card}
          iconName="payment"
          isActive={true}
          title="Безналичный расчет"
        />

        <H3 style={styles.title}>2. Куда зачислить</H3>

        <SelectableCard
          containerStyle={styles.card}
          isActive={true}
          isSubtitleFirst={false}
          subtitle="Баланс в RUB"
          title={`${CurrencyFormatter.format(
            props.currentBusinessAccount?.balance! || 0,
          )} ${CurrencyMap[APP_CURRENCY_MAP.RU]}`}
        />

        <H3 style={styles.title}>3. Детали перевода</H3>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          label="Наименование юридического лица"
          outlineType={props.errorName ? 'error' : undefined}
          value={props.name}
          onBlur={() => props.validateName()}
          onChange={props.setName}
          onSubmitEditing={() => props.refInn.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorName}</FieldError>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          inputRef={props.refInn}
          label="ИНН"
          outlineType={props.errorInn ? 'error' : undefined}
          value={props.inn}
          onBlur={() => props.validateInn()}
          onChange={props.setInn}
          onSubmitEditing={() => props.refKpp.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorInn}</FieldError>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          inputRef={props.refKpp}
          label="КПП"
          outlineType={props.errorKpp ? 'error' : undefined}
          value={props.kpp}
          onChange={props.setKpp}
          onSubmitEditing={() => props.refAddress.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorKpp}</FieldError>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          inputRef={props.refAddress}
          label="Юридический адрес"
          outlineType={props.errorAddress ? 'error' : undefined}
          value={props.address}
          onBlur={() => props.validateAddress()}
          onChange={props.setAddress}
          onSubmitEditing={() => props.refPhone.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorAddress}</FieldError>

        <MaskedInput
          containerStyle={styles.input}
          enablesReturnKeyAutomatically={true}
          inputRef={props.refPhone}
          keyboardType="phone-pad"
          label="Мобильный телефон"
          mask={RUSSIAN_PHONE_MASK}
          outlineType={props.errorPhone ? 'error' : undefined}
          returnKeyType="next"
          value={props.phone}
          onBlur={() => props.validatePhone()}
          onChange={(masked, unmasked) => {
            props.setPhone(masked);
            props.setPhoneUnmasked(unmasked);
          }}
          onSubmitEditing={() => props.refAmount.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorPhone}</FieldError>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          inputRef={props.refAmount}
          keyboardType="number-pad"
          label="Сумма перевода"
          outlineType={props.errorAmount ? 'error' : undefined}
          value={props.amount}
          onBlur={() => props.validateAmount()}
          onChange={props.setAmount}
          onSubmitEditing={props.onSubmit}
        />

        <FieldError style={styles.error}>{props.errorAmount}</FieldError>

        <H5 textAlign="center">
          В течение двух рабочих дней на вашу почту придёт счет на оплату. После
          оплаты счёта в течение рабочего дня, баланс вашего бизнес-аккаунта
          будет пополнен на соответствующую сумму.
        </H5>
        <ListExtender />
      </FormScrollingContainer>
      <AvoidKeyboard
        offset={20}
        style={styles.footer}
      >
        <Button
          isLoading={props.isSubmitting}
          onPress={props.onSubmit}
        >
          Сохранить
        </Button>
      </AvoidKeyboard>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    marginTop: 8,
    marginBottom: 12,
  },
  input: {
    marginTop: 8,
    marginBottom: 4,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  footer: {
    paddingBottom: SAFE_ZONE_BOTTOM,
    paddingHorizontal: 16,
  },
});

export default Layout;

import React from 'react';
import { StyleSheet } from 'react-native';

import { Button, FieldError, Header, TextInput } from '#ui-kit';
import SelectableCard from '#ui-kit/SelectableCard';
import { H3, H5 } from '#ui-kit/Text';

import { FormScrollingContainer, ListExtender } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import CurrencyFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import { CurrencyMap } from '#config/enums';

import { SAFE_ZONE_BOTTOM } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <>
      <Header
        hideRightIcon={true}
        paddingHorizontal={16}
        title="Balance replenishment"
        onPressLeft={props.navigation.goBack}
      />

      <FormScrollingContainer
        extraHeight={100}
        style={styles.container}
      >
        <H3 style={styles.title}>1. How to top up</H3>

        <SelectableCard
          containerStyle={styles.card}
          iconName="payment"
          isActive={true}
          title="Bank Transfer"
        />

        <H3 style={styles.title}>2. Account Link</H3>

        <SelectableCard
          containerStyle={styles.card}
          isActive={true}
          isSubtitleFirst={false}
          subtitle="Balance in USD"
          title={`${CurrencyFormatter.format(
            props.currentBusinessAccount?.balance! || 0,
          )} ${CurrencyMap[APP_CURRENCY_MAP.RU]}`}
        />

        <H3 style={styles.title}>3. Transfer Details</H3>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          label="Company name"
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
          label="Registration/Tax number"
          outlineType={props.errorInn ? 'error' : undefined}
          value={props.inn}
          onBlur={() => props.validateInn()}
          onChange={props.setInn}
          onSubmitEditing={() => props.refBank.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorInn}</FieldError>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          inputRef={props.refBank}
          label="Bank name"
          outlineType={props.errorBank ? 'error' : undefined}
          value={props.bank}
          onBlur={() => props.validateBank()}
          onChange={props.setBank}
          onSubmitEditing={() => props.refIban.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorBank}</FieldError>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          inputRef={props.refIban}
          label="Account number"
          outlineType={props.errorIban ? 'error' : undefined}
          value={props.iban}
          onBlur={() => props.validateIban()}
          onChange={props.setIban}
          onSubmitEditing={() => props.refBik.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorIban}</FieldError>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          inputRef={props.refBik}
          label="Routing number"
          outlineType={props.errorBik ? 'error' : undefined}
          value={props.bik}
          onBlur={() => props.validateBik()}
          onChange={props.setBik}
          onSubmitEditing={() => props.refSwift.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorBik}</FieldError>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          inputRef={props.refSwift}
          label="SWIFT"
          outlineType={props.errorSwift ? 'error' : undefined}
          value={props.swift}
          onBlur={() => props.validateSwift()}
          onChange={props.setSwift}
          onSubmitEditing={() => props.refSwift.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorSwift}</FieldError>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          inputRef={props.refBankAddress}
          label="Bank address"
          outlineType={props.errorBankAddress ? 'error' : undefined}
          value={props.bankAddress}
          onBlur={() => props.validateBankAddress()}
          onChange={props.setBankAddress}
          onSubmitEditing={() => props.refBankAddress.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorSwift}</FieldError>

        <TextInput
          androidFixScrollMultiline={true}
          containerStyle={styles.input}
          inputRef={props.refAmount}
          keyboardType="number-pad"
          label="Summ"
          outlineType={props.errorAmount ? 'error' : undefined}
          value={props.amount}
          onBlur={() => props.validateAmount()}
          onChange={props.setAmount}
          onSubmitEditing={props.onSubmit}
        />

        <FieldError style={styles.error}>{props.errorAmount}</FieldError>

        <H5 textAlign="center">
          An invoice for payment will be sent to your email within two business
          days. After payment of the invoice during the working day, the balance
          of your business account will be executed for the corresponding
          amount.
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
          Save
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

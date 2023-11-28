import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import { Button, FieldError, MaskedInput, Tabs, TextInput } from '#ui-kit';
import { H3, H5 } from '#ui-kit/Text';

import { FormScrollingContainer, ListExtender } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import { USA_PHONE_MASK } from '#config';

import { SAFE_ZONE_BOTTOM } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();

  return (
    <>
      <FormScrollingContainer style={styles.container}>
        {!props.route.params.isEdit && (
          <Tabs
            data={[
              {
                text: 'Individual',
                value: 0,
              },
              {
                text: 'Legal',
                value: 1,
              },
            ]}
            renderItem={item => (
              <Tabs.Tab
                displayValue={item.text}
                isActive={item.value === props.tab}
                size="small"
                value={item.value}
                onChange={props.setTab}
              />
            )}
            keyExtractor={item => item.value}
          />
        )}

        <View style={styles.main}>
          <H3 style={styles.title}>Company Info</H3>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            label="Registration/Tax Number"
            outlineType={props.errorInn ? 'error' : undefined}
            returnKeyType="next"
            value={props.inn}
            onChange={props.setInn}
            onSubmitEditing={() => props.refLegalName.current?.focus()}
          />

          <FieldError>{props.errorInn}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            label="Company name"
            outlineType={props.errorLegalName ? 'error' : undefined}
            returnKeyType="next"
            value={props.legalName}
            onChange={props.setLegalName}
            onSubmitEditing={() => props.refLegalAddress.current?.focus()}
          />

          <FieldError>{props.errorLegalName}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            label="Company registration address"
            outlineType={props.errorLegalAddress ? 'error' : undefined}
            returnKeyType="next"
            value={props.legalAddress}
            onChange={props.setLegalAddress}
            onSubmitEditing={() => props.refRepresentativeName.current?.focus()}
          />

          <FieldError>{props.errorLegalAddress}</FieldError>

          <H3 style={styles.title}>Authorized Representative</H3>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refRepresentativeName}
            label="First name"
            outlineType={props.errorRepresentativeName ? 'error' : undefined}
            returnKeyType="next"
            value={props.representativeName}
            onChange={props.setRepresentativeName}
            onSubmitEditing={() =>
              props.refRepresentativeLastName.current?.focus()
            }
          />

          <FieldError>{props.errorRepresentativeName}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refRepresentativeLastName}
            label="Last name"
            outlineType={
              props.errorRepresentativeLastName ? 'error' : undefined
            }
            returnKeyType="next"
            value={props.representativeLastName}
            onChange={props.setRepresentativeLastName}
            onSubmitEditing={() =>
              props.refRepresentativePosition.current?.focus()
            }
          />

          <FieldError>{props.errorRepresentativeLastName}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refRepresentativePosition}
            label="Position"
            outlineType={
              props.errorRepresentativePosition ? 'error' : undefined
            }
            returnKeyType="next"
            value={props.representativePosition}
            onChange={props.setRepresentativePosition}
            onSubmitEditing={() =>
              props.refRepresentativeBasedPosition.current?.focus()
            }
          />

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refRepresentativeBasedPosition}
            label="Based position"
            outlineType={
              props.errorRepresentativeBasedPosition ? 'error' : undefined
            }
            returnKeyType="next"
            value={props.representativeBasedPosition}
            onChange={props.setRepresentativeBasedPosition}
            onSubmitEditing={() => props.refName.current?.focus()}
          />

          <H3 style={styles.title}>Contact Person</H3>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refName}
            label="Name"
            outlineType={props.errorName ? 'error' : undefined}
            returnKeyType="next"
            value={props.name}
            onBlur={() => props.validateName()}
            onChange={props.setName}
            onSubmitEditing={() => props.refEmail.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorName}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refEmail}
            label="E-mail"
            outlineType={props.errorEmail ? 'error' : undefined}
            returnKeyType="next"
            value={props.email}
            onBlur={() => props.validateEmail()}
            onChange={props.setEmail}
            onSubmitEditing={() => props.refPhone.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorEmail}</FieldError>

          <MaskedInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refPhone}
            keyboardType="phone-pad"
            label="Phone number"
            mask={USA_PHONE_MASK}
            outlineType={props.errorPhone ? 'error' : undefined}
            returnKeyType="next"
            value={props.phone}
            onBlur={() => props.validatePhone()}
            onChange={(masked, unmasked) => {
              props.setPhone(masked);
              props.setPhoneUnmasked(unmasked);
            }}
            onSubmitEditing={() => props.refBank.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorPhone}</FieldError>

          <H3 style={styles.title}>Bank</H3>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refBank}
            label="Bank name"
            outlineType={props.errorBank ? 'error' : undefined}
            returnKeyType="next"
            value={props.bank}
            onBlur={() => props.validateBank()}
            onChange={props.setBank}
            onSubmitEditing={() => props.refBik.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorBank}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refBik}
            label="Routing Number"
            outlineType={props.errorBik ? 'error' : undefined}
            returnKeyType="next"
            value={props.bik}
            onBlur={() => props.validateBik()}
            onChange={props.setBik}
            onSubmitEditing={() => props.refIban.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorBik}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refIban}
            label="Account Number"
            outlineType={props.errorIban ? 'error' : undefined}
            returnKeyType="next"
            value={props.iban}
            onBlur={() => props.validateIban()}
            onChange={props.setIban}
            onSubmitEditing={() => props.refSwift.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorIban}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refSwift}
            label="SWIFT"
            outlineType={props.errorSwift ? 'error' : undefined}
            returnKeyType="next"
            value={props.swift}
            onBlur={() => props.validateSwift()}
            onChange={props.setSwift}
            onSubmitEditing={() => props.refBankAddress.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorSwift}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refBankAddress}
            label="Address"
            outlineType={props.errorBankAddress ? 'error' : undefined}
            returnKeyType="next"
            value={props.bankAddress}
            onBlur={() => props.validateBankAddress()}
            onChange={props.setBankAddress}
            onSubmitEditing={props.onCreateAccount}
          />

          <FieldError style={styles.error}>{props.errorBankAddress}</FieldError>

          {!props.route.params.isEdit && (
            <TouchableOpacity
              style={styles.conditionWithCheckbox}
              onPress={() =>
                Linking.openURL('http://ADSWallet.site/privacy-policy')
              }
            >
              <H5 style={styles.checkboxLabel}>
                By continuing you agree to the{' '}
                <H5
                  color={colors.primary.normal}
                  style={styles.textLink}
                >
                  contract offer
                </H5>
              </H5>
            </TouchableOpacity>
          )}

          <ListExtender />
        </View>
      </FormScrollingContainer>
      <AvoidKeyboard
        offset={20}
        style={styles.footer}
      >
        <Button
          isLoading={props.isSubmitting}
          onPress={props.onCreateAccount}
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
  main: {
    paddingTop: 4,
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
  conditionWithCheckbox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  checkboxLabel: {
    marginLeft: 12,
  },
  footer: {
    paddingBottom: SAFE_ZONE_BOTTOM,
    paddingHorizontal: 16,
  },
  textLink: {
    textDecorationLine: 'underline',
  },
});

export default Layout;

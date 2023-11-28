/* eslint-disable max-lines */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import {
  Button,
  Checkbox,
  FieldError,
  Icon,
  Loader,
  MaskedInput,
  Tabs,
  Text,
  TextInput,
} from '#ui-kit';
import { H3, H5 } from '#ui-kit/Text';

import { FormScrollingContainer, ListExtender } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import { RUSSIAN_PHONE_MASK } from '#config';
import {
  DocumentsDeliveryTypes,
  MapDocumentsDeliveryTypesText,
} from '#config/enums';

import { SAFE_ZONE_BOTTOM } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const renderInnIcon = () => {
    return props.isVerified ? (
      <Icon
        color={colors.success}
        name="check"
      />
    ) : props.isLoading ? (
      <Loader />
    ) : (
      <TouchableOpacity onPress={props.onCheckInn}>
        <Text color={colors.primary.normal}>Проверить</Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <FormScrollingContainer style={styles.container}>
        {!props.route.params.isEdit && (
          <Tabs
            data={[
              {
                text: 'Физлицо',
                value: 0,
              },
              {
                text: 'ИП или юрлицо',
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
          <H3 style={styles.title}>Компания</H3>

          <TextInput
            containerStyle={styles.input}
            disabled={props.route.params.isEdit}
            IconRight={!props.route.params.isEdit && renderInnIcon()}
            label="ИНН"
            outlineType={
              !props.route.params.isEdit && props.isVerified
                ? 'success'
                : undefined
            }
            value={props.inn}
            onChange={inn => {
              props.setInn(inn);
              props.resetVerified();
            }}
            onSubmitEditing={props.onCheckInn}
          />

          <FieldError style={styles.error}>{props.errorInn}</FieldError>

          {props.isVerified && (
            <>
              <Text color={colors.grayscale.__2}>Название юрлица</Text>
              <Text style={styles.description}>{props.legalName}</Text>

              <Text color={colors.grayscale.__2}>Юридический адрес</Text>
              <Text style={styles.description}>{props.legalAddress}</Text>

              <TextInput
                containerStyle={styles.input}
                disabled={props.isMailAddressEqualToLegalAddress}
                enablesReturnKeyAutomatically={true}
                label="Почтовый адрес"
                outlineType={props.errorMailAddress ? 'error' : undefined}
                returnKeyType="done"
                value={
                  props.isMailAddressEqualToLegalAddress
                    ? props.legalAddress
                    : props.mailAddress
                }
                onBlur={() => props.validateMailAddress()}
                onChange={props.setMailAddress}
                onSubmitEditing={() => props.refName.current?.focus()}
              />

              <FieldError style={styles.error}>
                {props.errorMailAddress}
              </FieldError>

              <TouchableOpacity
                style={styles.conditionWithCheckbox}
                onPress={() => {
                  props.setIsMailAddressEqualToLegalAddress(old => !old);
                  props.validateMailAddress(
                    props.mailAddress,
                    !props.isMailAddressEqualToLegalAddress,
                  );
                }}
              >
                <Checkbox value={props.isMailAddressEqualToLegalAddress} />
                <H5 style={styles.checkboxLabel}>
                  Почтовый адрес соответствует юридическому
                </H5>
              </TouchableOpacity>

              <H3 style={styles.title}>Контактное лицо</H3>

              <TextInput
                containerStyle={styles.input}
                enablesReturnKeyAutomatically={true}
                inputRef={props.refName}
                label="Имя"
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
                label="Электронная почта"
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
                onSubmitEditing={() => props.refBank.current?.focus()}
              />

              <FieldError style={styles.error}>{props.errorPhone}</FieldError>

              <H3 style={styles.title}>Закрывающие документы</H3>

              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(AppRoutes.Modals, {
                    screen: ModalsRoutes.Select,
                    params: {
                      data: [
                        DocumentsDeliveryTypes.COURIER,
                        DocumentsDeliveryTypes.IN_OFFICE,
                      ],
                      keyExtractor: (item: DocumentsDeliveryTypes) => item,
                      checkedExtractor: (
                        item: DocumentsDeliveryTypes,
                        currentItem: DocumentsDeliveryTypes,
                      ) => item === currentItem,
                      renderItem: (item: DocumentsDeliveryTypes) => (
                        <Text style={styles.selectItem}>
                          {MapDocumentsDeliveryTypesText[item]}
                        </Text>
                      ),
                      onSelectionEnd: item =>
                        props.setDocumentsDeliveryMethod(item),
                      title: 'Выберите тип закрывающего документа',
                      withCheckMark: true,
                      defaultValue: props.documentsDeliveryMethod,
                    },
                  });
                }}
              >
                <TextInput
                  containerStyle={styles.input}
                  IconRight={<Icon name="swap" />}
                  label="Способ получения оригиналов"
                  pointerEvents="none"
                  value={
                    MapDocumentsDeliveryTypesText[props.documentsDeliveryMethod]
                  }
                />
              </TouchableOpacity>

              <H3 style={styles.title}>Банк</H3>

              <TextInput
                containerStyle={styles.input}
                enablesReturnKeyAutomatically={true}
                inputRef={props.refBank}
                label="Название банка"
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
                label="БИК"
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
                label="Расчетный счёт"
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
                label="Корреспондентский счет"
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
                label="Адрес банка"
                outlineType={props.errorBankAddress ? 'error' : undefined}
                returnKeyType="next"
                value={props.bankAddress}
                onBlur={() => props.validateBankAddress()}
                onChange={props.setBankAddress}
                onSubmitEditing={props.onCreateAccount}
              />

              <FieldError style={styles.error}>
                {props.errorBankAddress}
              </FieldError>

              {!props.route.params.isEdit && (
                <TouchableOpacity
                  style={styles.conditionWithCheckbox}
                  onPress={() =>
                    Linking.openURL('http://ADSWallet.site/privacy-policy')
                  }
                >
                  <H5 style={styles.checkboxLabel}>
                    Продолжная вы соглашаетесь с{' '}
                    <H5
                      color={colors.primary.normal}
                      style={styles.textLink}
                    >
                      Договором оферты
                    </H5>
                  </H5>
                </TouchableOpacity>
              )}

              <ListExtender />
            </>
          )}
        </View>
      </FormScrollingContainer>
      {props.isVerified && (
        <AvoidKeyboard
          offset={20}
          style={styles.footer}
        >
          <Button
            isLoading={props.isSubmitting}
            onPress={props.onCreateAccount}
          >
            Сохранить
          </Button>
        </AvoidKeyboard>
      )}
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
  selectItem: {
    paddingVertical: 16,
  },
  input: {
    marginTop: 8,
    marginBottom: 4,
  },
  description: {
    marginBottom: 8,
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

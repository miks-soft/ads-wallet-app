import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import {
  Button,
  FieldError,
  Icon,
  MaskedInput,
  Tabs,
  Text,
  TextInput,
} from '#ui-kit';
import { H3, H5 } from '#ui-kit/Text';

import { FormScrollingContainer } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import { RUSSIAN_PHONE_MASK } from '#config';
import {
  ReceiptDeliveryTypes,
  MapReceiptDeliveryTypesText,
} from '#config/enums';

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
          <H3 style={styles.title}>Контактное лицо</H3>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refSurname}
            label="Фамилия"
            outlineType={props.errorSurname ? 'error' : undefined}
            returnKeyType="next"
            value={props.surname}
            onChange={props.setSurname}
            onSubmitEditing={() => props.refName.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorSurname}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refName}
            label="Имя"
            outlineType={props.errorName ? 'error' : undefined}
            returnKeyType="next"
            value={props.name}
            onChange={props.setName}
            onSubmitEditing={() => props.refPatronymic.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorName}</FieldError>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refPatronymic}
            label="Отчество"
            outlineType={props.errorPatronymic ? 'error' : undefined}
            returnKeyType="next"
            value={props.patronymic}
            onChange={props.setPatronymic}
            onSubmitEditing={() => props.refEmail.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorPatronymic}</FieldError>

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
          />

          <FieldError style={styles.error}>{props.errorPhone}</FieldError>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(AppRoutes.Modals, {
                screen: ModalsRoutes.Select,
                params: {
                  data: [ReceiptDeliveryTypes.SMS, ReceiptDeliveryTypes.EMAIL],
                  keyExtractor: (item: ReceiptDeliveryTypes) => item,
                  checkedExtractor: (item, currentItem) => item === currentItem,
                  renderItem: (item: ReceiptDeliveryTypes) => (
                    <Text style={styles.selectItem}>
                      {MapReceiptDeliveryTypesText[item]}
                    </Text>
                  ),
                  onSelectionEnd: item => props.setReceiptDeliveryMethod(item),
                  title: 'Выберите способ получения чеков',
                  withCheckMark: true,
                  defaultValue: props.receiptDeliveryMethod,
                },
              });
            }}
          >
            <TextInput
              containerStyle={styles.input}
              IconRight={<Icon name="swap" />}
              label="Получать чеки"
              pointerEvents="none"
              value={MapReceiptDeliveryTypesText[props.receiptDeliveryMethod]}
            />
          </TouchableOpacity>

          {!props.route.params.isEdit && (
            <H5
              style={styles.privacy}
              textAlign="center"
            >
              Продолжная вы соглашаетесь с{' '}
              <H5
                color={colors.primary.normal}
                style={styles.textLink}
                onPress={() =>
                  Linking.openURL('http://ADSWallet.site/privacy-policy')
                }
              >
                Договором оферты
              </H5>
            </H5>
          )}
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
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  footer: {
    paddingBottom: SAFE_ZONE_BOTTOM,
    paddingHorizontal: 16,
  },
  textLink: {
    textDecorationLine: 'underline',
  },
  privacy: {
    paddingVertical: 4,
  },
});

export default Layout;

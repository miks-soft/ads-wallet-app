import React from 'react';
import { StyleSheet, View, Linking, TouchableOpacity } from 'react-native';

import { useSelector } from '#hooks/redux';

import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  TextInput,
  Button,
  Text,
  Icon,
  MaskedInput,
  FieldError,
  Radio,
} from '#ui-kit';
import { H2, H4, H5 } from '#ui-kit/Text';

import { FormScrollingContainer } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import { AuthRoutes } from '#navigation/Auth/types';

import { STRINGS } from '#localization';

import LayoutAdaptor from '#services/LayoutAdaptor';

import { REGIONS, RUSSIAN_PHONE_MASK, USA_PHONE_MASK } from '#config';
import { LOGO_MAP } from '#config/images';

import { SAFE_ZONE_BOTTOM } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';
import { AccountTypes } from './types';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const region = useSelector(store => store.app.region);
  const styles = getStyles(colors, region);
  const t = STRINGS.SCREEN_SIGN_UP;

  const renderPasswordValidationError = (passed: boolean, text: text) => (
    <View style={styles.error}>
      <Icon
        color={passed ? colors.success : colors.error.classic}
        name={passed ? 'check' : 'close'}
        size={16}
      />
      <Text color={passed ? colors.success : colors.error.classic}>{text}</Text>
    </View>
  );

  return (
    <>
      <FormScrollingContainer
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
        <SafeAreaView edges={['top']}>
          <FastImage
            source={LOGO_MAP[region]}
            style={styles.logo}
          />

          <View style={styles.info}>
            <H2
              style={styles.title}
              textAlign="center"
            >
              {t.title}
            </H2>

            <H4
              color={colors.grayscale.__2}
              textAlign="center"
            >
              {t.subtitle}
            </H4>
          </View>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refMailInput}
            label={t.emailInputLabel}
            outlineType={props.errorMail ? 'error' : undefined}
            returnKeyType="next"
            value={props.mail}
            onBlur={() => props.validateMail()}
            onChange={props.setMail}
            onSubmitEditing={() => props.refPhoneInput.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorMail}</FieldError>

          <MaskedInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            inputRef={props.refPhoneInput}
            keyboardType="phone-pad"
            label={t.emailInputLabel}
            mask={region === 'RU' ? RUSSIAN_PHONE_MASK : USA_PHONE_MASK}
            outlineType={props.errorPhone ? 'error' : undefined}
            returnKeyType="next"
            value={props.phone}
            onBlur={() => props.validatePhone()}
            onChange={(masked, unmasked) => {
              props.setPhone(masked);
              props.setPhoneUnmasked(unmasked);
            }}
            onSubmitEditing={() => props.refPasswordInput.current?.focus()}
          />

          <FieldError style={styles.error}>{props.errorPhone}</FieldError>

          <TextInput
            containerStyle={styles.input}
            IconRight={
              <TouchableOpacity
                onPress={() => props.setIsPasswordMasked(old => !old)}
              >
                <Icon
                  color={colors.grayscale.__1}
                  name={props.isPasswordMasked ? 'eye' : 'eye-closed'}
                />
              </TouchableOpacity>
            }
            inputRef={props.refPasswordInput}
            label={t.passwordInputLabel}
            outlineType={
              props.errorPasswords &&
              !!Object.values(props.errorPasswords).filter(el => !el).length
                ? 'error'
                : undefined
            }
            returnKeyType="next"
            secureTextEntry={props.isPasswordMasked}
            value={props.password}
            onBlur={() => props.validatePassword()}
            onChange={password => {
              props.setPassword(password);
              props.setErrorPasswords(undefined);
            }}
            onSubmitEditing={() =>
              props.refRepeatedPasswordInput.current?.focus()
            }
          />

          {props.errorPasswords &&
            !!Object.values(props.errorPasswords).filter(el => !el).length && (
              <>
                {renderPasswordValidationError(
                  props.errorPasswords.length,
                  t.passwordLengthError,
                )}
                {renderPasswordValidationError(
                  props.errorPasswords.number,
                  t.passwordDigitError,
                )}
                {renderPasswordValidationError(
                  props.errorPasswords.lowercaseChar,
                  t.passwordLowercaseError,
                )}
                {renderPasswordValidationError(
                  props.errorPasswords.uppercaseChar,
                  t.passwordUppercaseError,
                )}
              </>
            )}

          <TextInput
            containerStyle={styles.input}
            IconRight={
              <TouchableOpacity
                onPress={() => props.setIsRepeatedPasswordMasked(old => !old)}
              >
                <Icon
                  color={colors.grayscale.__1}
                  name={props.isRepeatedPasswordMasked ? 'eye' : 'eye-closed'}
                />
              </TouchableOpacity>
            }
            inputRef={props.refRepeatedPasswordInput}
            label={t.repeatPasswordInputLabel}
            outlineType={props.errorRepeatedPassword ? 'error' : undefined}
            returnKeyType="done"
            secureTextEntry={props.isRepeatedPasswordMasked}
            value={props.repeatedPassword}
            onBlur={() =>
              props.validateRepeatedPassword(
                props.password,
                props.repeatedPassword,
              )
            }
            onChange={props.setRepeatedPassword}
            onSubmitEditing={props.onSignUp}
          />

          <FieldError style={styles.error}>
            {props.errorRepeatedPassword}
          </FieldError>

          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioLine}
              onPress={() => {
                props.setAccountType(AccountTypes.PERSON);
              }}
            >
              <Radio
                containerStyle={styles.radio}
                value={props.accountType === AccountTypes.PERSON}
              />
              <Text>{t.personRadioValue}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioLine}
              onPress={() => {
                props.setAccountType(AccountTypes.ORGANIZATION);
              }}
            >
              <Radio
                containerStyle={styles.radio}
                value={props.accountType === AccountTypes.ORGANIZATION}
              />
              <Text>{t.organizationRadioValue}</Text>
            </TouchableOpacity>
          </View>

          <FieldError style={styles.error}>{props.errorAccountType}</FieldError>

          <View style={styles.privacy}>
            <H5
              color={colors.grayscale.__2}
              style={styles.privacyText}
              textAlign="center"
            >
              {STRINGS.SHARED.privacy_1}
              <H5
                color={colors.primary.normal}
                style={styles.privacyLink}
                onPress={() =>
                  Linking.openURL('http://ADSWallet.site/agreement')
                }
              >
                {STRINGS.SHARED.privacy_2}
              </H5>{' '}
              {STRINGS.SHARED.and}{' '}
              <H5
                color={colors.primary.normal}
                style={styles.privacyLink}
                onPress={() =>
                  Linking.openURL('http://ADSWallet.site/privacy-policy')
                }
              >
                {STRINGS.SHARED.privacy_3}
              </H5>
            </H5>
          </View>
        </SafeAreaView>
      </FormScrollingContainer>

      <AvoidKeyboard
        offset={72}
        style={styles.footer}
      >
        <Button
          isLoading={props.isLoading}
          style={styles.button}
          onPress={props.onSignUp}
        >
          {t.actionButtonTitle}
        </Button>
        <TouchableOpacity
          style={styles.signInLink}
          onPress={() => props.navigation.navigate(AuthRoutes.SignIn)}
        >
          <H4>
            {t.alreadyHaveAccount}{' '}
            <H4
              color={colors.primary.normal}
              weight="500"
            >
              {t.signIn}
            </H4>
          </H4>
        </TouchableOpacity>
      </AvoidKeyboard>
    </>
  );
};

const getStyles = (colors: Colors, region: REGIONS) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    logo: {
      width: 154,
      aspectRatio: region === 'USA' ? 150 / 60 : 154 / 32,
      marginVertical: LayoutAdaptor.h(44, 10),
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    title: {
      marginBottom: 12,
    },
    info: {
      marginTop: LayoutAdaptor.h(12, 5),
      marginBottom: LayoutAdaptor.h(24, 5),
    },
    contentContainer: {
      flexGrow: 1,
    },
    input: {
      marginTop: 8,
      marginBottom: 4,
    },
    privacy: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: LayoutAdaptor.h(4, 5),
      marginBottom: 160,
    },
    privacyText: {
      flex: 1,
      alignItems: 'center',
    },
    privacyLink: {
      textDecorationLine: 'underline',
    },
    error: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    footer: {
      width: '100%',
      position: 'absolute',
      bottom: 0,
      paddingHorizontal: 16,
      backgroundColor: colors.white,
    },
    button: {
      marginTop: 'auto',
      marginBottom: 24,
    },
    signInLink: {
      alignItems: 'center',
      paddingBottom: SAFE_ZONE_BOTTOM,
    },
    radioGroup: {
      marginTop: 12,
    },
    radio: {
      marginRight: 8,
    },
    radioLine: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
  });
export default Layout;

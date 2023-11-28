import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { useSelector } from '#hooks/redux';

import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextInput, Button, Text, Icon, FieldError } from '#ui-kit';
import { H2, H4 } from '#ui-kit/Text';

import { FormScrollingContainer } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import { AuthRoutes } from '#navigation/Auth/types';
import { RestorePasswordRoutes } from '#navigation/RestorePassword/types';
import { AppRoutes } from '#navigation/types';

import { STRINGS } from '#localization';

import LayoutAdaptor from '#services/LayoutAdaptor';

import { REGIONS } from '#config';
import { LOGO_MAP } from '#config/images';

import { SAFE_ZONE_BOTTOM } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const region = useSelector(store => store.app.region);
  const styles = getStyles(colors, region);
  const t = STRINGS.SCREEN_SIGN_IN;

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
        <SafeAreaView
          edges={['top']}
          style={styles.contentContainer}
        >
          <FastImage
            source={LOGO_MAP[region]}
            style={styles.logo}
          />

          <View style={styles.main}>
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
              onChange={props.setMail}
              onSubmitEditing={() => props.refPasswordInput.current?.focus()}
            />

            <FieldError style={styles.error}>{props.errorMail}</FieldError>

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
              onChange={password => {
                props.setPassword(password);
                props.setErrorPasswords(undefined);
              }}
              onSubmitEditing={props.onSignIn}
            />

            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate(AppRoutes.StackRestorePassword, {
                  screen: RestorePasswordRoutes.Email,
                })
              }
            >
              <Text
                color={colors.primary.normal}
                textAlign="right"
              >
                {t.forgotPassword}
              </Text>
            </TouchableOpacity>

            <FieldError style={styles.error}>{props.errorPassword}</FieldError>

            {props.errorPasswords &&
              !!Object.values(props.errorPasswords).filter(el => !el)
                .length && (
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
          </View>
        </SafeAreaView>
      </FormScrollingContainer>

      <AvoidKeyboard
        offset={64}
        style={styles.footer}
      >
        <Button
          isLoading={props.isLoading}
          style={styles.button}
          onPress={props.onSignIn}
        >
          {t.actionButtonTitle}
        </Button>
        <TouchableOpacity
          style={styles.signInLink}
          onPress={() => props.navigation.navigate(AuthRoutes.SignUp)}
        >
          <H4>
            {t.dontHaveAccount}{' '}
            <H4
              color={colors.primary.normal}
              weight="500"
            >
              {t.signUp}
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
      marginTop: 12,
      marginBottom: 24,
    },
    main: {
      flex: 1,
      flexGrow: 1,
      justifyContent: 'center',
      marginBottom: 180,
    },
    contentContainer: {
      flexGrow: 1,
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
  });

export default Layout;

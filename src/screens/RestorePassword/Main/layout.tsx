import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { useSelector } from '#hooks/redux';

import FastImage from 'react-native-fast-image';

import { TextInput, Button, Text, Icon, Header, FieldError } from '#ui-kit';
import { H2, H4 } from '#ui-kit/Text';

import { FormScrollingContainer } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import { STRINGS } from '#localization';

import { REGIONS } from '#config';
import { LOGO_MAP } from '#config/images';

import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const region = useSelector(store => store.app.region);
  const styles = getStyles(colors, region);
  const t = STRINGS.SCREEN_RESTORE_PASSWORD_MAIN;
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
        <Header
          hideRightIcon={true}
          paddingHorizontal={0}
          onPressLeft={props.navigation.goBack}
        />

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

          <FieldError style={styles.error}>{props.errorPassword}</FieldError>

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
            onSubmitEditing={props.onRestorePassword}
          />

          <FieldError style={styles.error}>
            {props.errorRepeatedPassword}
          </FieldError>
        </View>
      </FormScrollingContainer>

      <AvoidKeyboard
        offset={24}
        style={styles.footer}
      >
        <Button
          isLoading={props.isLoading}
          style={styles.button}
          onPress={props.onRestorePassword}
        >
          {t.actionButton}
        </Button>
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
      marginVertical: 44,
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
      marginBottom: 34,
    },
  });

export default Layout;

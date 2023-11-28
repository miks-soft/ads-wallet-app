import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { useSelector } from '#hooks/redux';

import FastImage from 'react-native-fast-image';

import { TextInput, Button, Header, FieldError } from '#ui-kit';
import { H2, H4 } from '#ui-kit/Text';

import { FormScrollingContainer } from '#components';
import { useTimer } from '#components/providers/OTPTimerProvider';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import { AuthRoutes } from '#navigation/Auth/types';
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
  const timer = useTimer();
  const t = STRINGS.SCREEN_RESTORE_PASSWORD_EMAIL;

  return (
    <>
      <FormScrollingContainer
        contentContainerStyle={styles.contentContainer}
        extraHeight={100}
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
            enablesReturnKeyAutomatically={true}
            label={t.emailInputLabel}
            outlineType={props.errorMail ? 'error' : undefined}
            returnKeyType="next"
            value={props.mail}
            onBlur={() => props.validateMail(props.mail)}
            onChange={props.setMail}
            onSubmitEditing={props.onSendEmail}
          />

          <FieldError style={styles.error}>{props.errorMail}</FieldError>
        </View>
      </FormScrollingContainer>

      <AvoidKeyboard
        offset={72}
        style={styles.footer}
      >
        <Button
          disabled={timer.valueRaw > 1}
          isLoading={props.isLoading}
          style={styles.button}
          onPress={props.onSendEmail}
        >
          {timer.valueRaw > 1 ? timer.value : t.actionButton}
        </Button>
        <TouchableOpacity
          style={styles.RestorePasswordEmailLink}
          onPress={() =>
            props.navigation.navigate(AppRoutes.StackAuth, {
              screen: AuthRoutes.SignIn,
            })
          }
        >
          <H4>
            {t.rememberPassword}{' '}
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
      marginTop: 2,
      marginBottom: LayoutAdaptor.h(44, 10),
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
    RestorePasswordEmailLink: {
      alignItems: 'center',
      paddingBottom: SAFE_ZONE_BOTTOM,
    },
  });

export default Layout;

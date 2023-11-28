import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSelector } from '#hooks/redux';

import FastImage from 'react-native-fast-image';

import { TextInput, Button, Header, FieldError } from '#ui-kit';
import { H2, H4 } from '#ui-kit/Text';

import { FormScrollingContainer } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import { STRINGS } from '#localization';

import LayoutAdaptor from '#services/LayoutAdaptor';

import { REGIONS } from '#config';
import { LOGO_MAP } from '#config/images';

import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const region = useSelector(store => store.app.region);
  const styles = getStyles(colors, region);
  const t = STRINGS.SCREEN_RESTORE_PASSWORD_CODE;

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
              {STRINGS.formatString(t.subtitle, props.route.params.email)}
            </H4>
          </View>

          <TextInput
            containerStyle={styles.input}
            enablesReturnKeyAutomatically={true}
            label={t.codeInputLabel}
            outlineType={props.errorCode ? 'error' : undefined}
            returnKeyType="next"
            value={props.code}
            onChange={props.setCode}
            onSubmitEditing={props.onVerifyCode}
          />

          <FieldError style={styles.error}>{props.errorCode}</FieldError>
        </View>
      </FormScrollingContainer>

      <AvoidKeyboard
        offset={24}
        style={styles.footer}
      >
        <Button
          disabled={props.code.length < 8}
          isLoading={props.isLoading}
          style={styles.button}
          onPress={props.onVerifyCode}
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
      marginBottom: 34,
    },
  });

export default Layout;

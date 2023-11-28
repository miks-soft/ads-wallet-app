import React from 'react';
import { View, StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image';

import { Button, Header, Text } from '#ui-kit';
import { H1 } from '#ui-kit/Text';

import { STRINGS } from '#localization';

import Images from '#config/images';

import { SAFE_ZONE_BOTTOM } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.SCREEN_STUBS_NOT_VERIFIED;
  return (
    <View style={styles.container}>
      <Header
        hideLeftIcon={true}
        hideRightIcon={true}
        paddingHorizontal={0}
      />

      <View style={styles.content}>
        <FastImage
          source={Images.Error}
          style={styles.image}
        />
        <H1 style={styles.title}>{t.title}</H1>
        <Text textAlign="center">{t.message}</Text>
      </View>

      <View style={styles.footer}>
        <Button
          isLoading={props.isLoading}
          style={styles.createBusinessAccountButton}
          onPress={props.onResendEmail}
        >
          {t.actionButton}
        </Button>

        <Button
          isLoading={props.isLoggingOut}
          type="secondary"
          onPress={props.onLogout}
        >
          {t.logOut}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  createBusinessAccountButton: {
    marginBottom: 8,
  },
  image: {
    width: '25%',
    aspectRatio: 1,
  },
  title: {
    marginBottom: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: SAFE_ZONE_BOTTOM,
  },
});

export default Layout;

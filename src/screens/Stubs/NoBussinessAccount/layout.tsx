import React from 'react';
import { View, StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image';

import { Button, Header, Text } from '#ui-kit';

import { BusinessAccountRoutes } from '#navigation/BusinessAccount/types';
import { AppRoutes } from '#navigation/types';

import { STRINGS } from '#localization';

import Images from '#config/images';

import { SAFE_ZONE_BOTTOM } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.SCEEN_STUB_NO_BUSINESS_ACCOUNT;
  return (
    <View style={styles.container}>
      <Header
        hideLeftIcon={true}
        paddingHorizontal={0}
      />
      <View style={styles.content}>
        <FastImage
          source={Images.NoBusinessAccount}
          style={styles.image}
        />
        <Text textAlign="center">{t.message}</Text>
      </View>

      <View style={styles.footer}>
        <Button
          style={styles.createBusinessAccountButton}
          onPress={() =>
            props.navigation.navigate(AppRoutes.StackBusinessAccount, {
              screen: BusinessAccountRoutes.CU,
              params: {},
            })
          }
        >
          [t.actionButton]
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
    width: '100%',
    aspectRatio: 343 / 194,
    marginBottom: 12,
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

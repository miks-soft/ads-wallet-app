import React from 'react';
import { View, StyleSheet, Linking, ScrollView } from 'react-native';

import { Header, Text } from '#ui-kit';

import { STRINGS } from '#localization';

import { SAFE_ZONE_BOTTOM } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.SCREEN_CREATE_VK_ADS_ACCOUNT;
  return (
    <>
      <Header
        hideRightIcon={true}
        paddingHorizontal={16}
        title={t.title}
        onPressLeft={props.navigation.goBack}
      />
      <ScrollView style={styles.container}>
        <Text>
          {t.step1_part1}{' '}
          <Text
            weight="500"
            onPress={() => Linking.openURL('https://ads.vk.com/')}
          >
            https://ads.vk.com/
          </Text>{' '}
          {t.step1_part2} {'\n'}
          {'\n'}
          {t.step2} {'\n'}
          {'\n'}
          {t.step3} {'\n'}
          {'\n'}
          {t.step4} {'\n'}
          {'\n'}
          {t.step5} {'\n'}
          {'\n'}
          {t.step6} {'\n'}
          {'\n'}
          {t.step7} {'\n'}
          <Text weight="500">{t.prerequisite}</Text>
        </Text>
        <View style={styles.bottomExtender} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },

  bottomExtender: {
    paddingBottom: SAFE_ZONE_BOTTOM,
  },
});

export default Layout;

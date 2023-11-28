import React from 'react';
import { View, StyleSheet, Linking, ScrollView } from 'react-native';

import FastImage, { Source } from 'react-native-fast-image';

import { Header, Text } from '#ui-kit';

import { STRINGS } from '#localization';

import Images from '#config/images';

import { shadow, SAFE_ZONE_BOTTOM } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const t = STRINGS.SCREEN_CREATE_MY_TARGET_ACCOUNT;

  const renderImage = (source: Source) => {
    return (
      <View style={[styles.imageContainer, shadow.style]}>
        <FastImage
          source={source}
          style={[styles.image, shadow.style]}
        />
      </View>
    );
  };

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
          {t.step1}{' '}
          <Text
            color={colors.primary.normal}
            onPress={() => Linking.openURL('https://target.my.com')}
          >
            https://target.my.com
          </Text>
        </Text>

        {renderImage(Images.MyTargetStep1)}

        <Text>{t.step2}</Text>

        {renderImage(Images.MyTargetStep2)}

        <Text>{t.step3}</Text>

        {renderImage(Images.MyTargetStep3)}

        <Text>{t.decsription}</Text>
        <View style={styles.bottomExtender} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  image: {
    height: 500,
    aspectRatio: 0.45,
    borderRadius: 8,
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  bottomExtender: {
    paddingBottom: SAFE_ZONE_BOTTOM,
  },
});

export default Layout;

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import FastImage from 'react-native-fast-image';

import { Icon, Text } from '#ui-kit';
import { H4 } from '#ui-kit/Text';

import Images from '#config/images';

import { useColors } from '#styles/theme/ColorsContext';

interface IBusinessAccount {
  item: any;
  isActive: boolean;
  onPressShow: () => void;
  onPress: () => void;
}

const BusinessAccount: React.FC<IBusinessAccount> = ({
  item,
  onPressShow = () => {},
  onPress = () => {},
  isActive = false,
}) => {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          {
            borderColor: isActive
              ? colors.primary.normal
              : colors.grayscale.__55,
          },
        ]}
      >
        <FastImage
          source={Images.DefaultAvatar}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text
            lineHeight={18}
            weight="700"
          >
            {item.legal_name
              ? item.legal_name
              : `${item.first_name} ${item.last_name}`}
          </Text>
          <H4 lineHeight={20}>{item.email}</H4>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity onPress={onPressShow}>
            <Icon
              color={colors.grayscale.__2}
              name="open"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
  },
  avatar: {
    width: 40,
    aspectRatio: 1,
    marginRight: 16,
    borderRadius: 20,
  },
  info: {
    flex: 1,
  },
  menu: {
    marginTop: -6,
  },
});

export default React.memo(BusinessAccount);

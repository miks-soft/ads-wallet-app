import React from 'react';
import { StyleSheet, StyleProp } from 'react-native';

import FastImage, { ImageStyle } from 'react-native-fast-image';

export const iconsFiles = {
  /* PLOP_INJECT_KEY */
  info: require('../assets/icons/info.png'),
  'chevron-up': require('../assets/icons/chevron-up.png'),
  trash: require('../assets/icons/trash.png'),
  plus: require('../assets/icons/plus.png'),
  send: require('../assets/icons/send.png'),
  attach: require('../assets/icons/attach.png'),
  chat: require('../assets/icons/chat.png'),
  'chevron-bottom': require('../assets/icons/chevron-bottom.png'),
  'price-change': require('../assets/icons/price-change.png'),
  'chevron-right-marginless': require('../assets/icons/chevron-right-marginless.png'),
  'chevron-left-marginless': require('../assets/icons/chevron-left-marginless.png'),
  'chevron-right': require('../assets/icons/chevron-right.png'),
  desc: require('../assets/icons/desc.png'),
  asc: require('../assets/icons/asc.png'),
  'more-vert': require('../assets/icons/more-vert.png'),
  search: require('../assets/icons/search.png'),
  sort: require('../assets/icons/sort.png'),
  filter: require('../assets/icons/filter.png'),
  'person-add': require('../assets/icons/person-add.png'),
  money: require('../assets/icons/money.png'),
  payment: require('../assets/icons/payment.png'),
  wallet: require('../assets/icons/wallet.png'),
  bars: require('../assets/icons/bars.png'),
  open: require('../assets/icons/open.png'),
  pencil: require('../assets/icons/pencil.png'),
  copy: require('../assets/icons/copy.png'),
  'trending-up': require('../assets/icons/trending-up.png'),
  help: require('../assets/icons/help.png'),
  'calendar-today': require('../assets/icons/calendar-today.png'),
  'bar-diagram': require('../assets/icons/bar-diagram.png'),
  eye: require('../assets/icons/eye.png'),
  vk: require('../assets/icons/vk.png'),
  toll: require('../assets/icons/toll.png'),
  'supervisor-account': require('../assets/icons/supervisor-account.png'),
  assignment: require('../assets/icons/assignment.png'),
  close: require('../assets/icons/close.png'),
  check: require('../assets/icons/check.png'),
  exit: require('../assets/icons/exit.png'),
  swap: require('../assets/icons/swap.png'),
  settings: require('../assets/icons/settings.png'),
  'eye-closed': require('../assets/icons/eye-closed.png'),
  'chevron-left': require('../assets/icons/chevron-left.png'),
};

export type IconNames = keyof typeof iconsFiles;

export interface IIcon {
  size: number;
  width: number;
  height: number;
  color: string;
  style: StyleProp<ImageStyle>;
  resizeMode: 'cover' | 'contain' | 'stretch' | 'center';
  name: IconNames;
}

const Icon: React.FC<Partial<IIcon>> = ({
  size = 24,
  width = size,
  height = size,
  color,
  name = 'eye',
  style = {},
  resizeMode = 'cover',
}) => {
  const styles = getStyles({
    width,
    height,
  });

  return (
    <FastImage
      resizeMode={resizeMode}
      source={iconsFiles[name]}
      style={[styles.icon, StyleSheet.flatten(style)]}
      tintColor={color}
    />
  );
};

const getStyles = ({
  width,
  height,
}: Pick<Partial<IIcon>, 'width' | 'height'>) =>
  StyleSheet.create({
    icon: {
      height: height,
      width: width,
    },
  });

export default React.memo(Icon);

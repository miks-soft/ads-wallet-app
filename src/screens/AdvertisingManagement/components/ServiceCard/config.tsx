import { StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { IconNames } from '#ui-kit/Icon';

import { SCREEN_WIDTH } from '#styles';

export interface ICard {
  iconName: IconNames;
  onPress: () => void;
  onRefresh: () => void;
  title: string;
  subtitle: string;
  isActive: boolean;
  isSubtitleFirst: boolean;
  containerStyle: StyleProp<ViewStyle>;
}

const SERVICE_CARD_WIDTH = SCREEN_WIDTH;

const cardStyles = StyleSheet.create({
  wrapper: {
    height: 88,
    width: SERVICE_CARD_WIDTH,
    paddingHorizontal: 16,
  },
  balance: {
    flexDirection: 'row',
  },
  logo: {
    width: 72,
    aspectRatio: 1,
  },
  container: {
    height: 88,
    flexDirection: 'row',
    flexShrink: 1,
    alignItems: 'center',
    padding: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  brand: {
    paddingBottom: 5,
  },
  main: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sideMenu: {
    height: '100%',
    marginLeft: 'auto',
    paddingTop: 6,
  },
  sideMenuAction: {
    marginBottom: 8,
  },
});

export { cardStyles, SERVICE_CARD_WIDTH };

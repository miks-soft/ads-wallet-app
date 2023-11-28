import { Dimensions, Platform, StyleSheet } from 'react-native';

// eslint-disable-next-line no-restricted-imports
import { SharedValue, withSpring } from 'react-native-reanimated';

import { defaultColors } from './theme';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const IS_IOS = Platform.OS === 'ios';

const hitSlop = {
  bottom: 16,
  left: 16,
  right: 16,
  top: 16,
};

const shadow = StyleSheet.create({
  style: {
    elevation: 3,
    shadowColor: defaultColors.black,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowRadius: 2.22,
    shadowOpacity: 0.22,
  },
});

const customAnimateTo = (
  sharedValue: SharedValue<number>,
  toValue: number,
  cb?: () => void,
) => {
  'worklet';
  sharedValue.value = withSpring(
    toValue,
    {
      stiffness: 100,
      mass: 0.2,
    },
    cb,
  );
};

const SAFE_ZONE_BOTTOM = 34;

const modalSafeZone = StyleSheet.create({
  style: {
    marginBottom: 8,
  },
});

export {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  hitSlop,
  SAFE_ZONE_BOTTOM,
  customAnimateTo,
  shadow,
  modalSafeZone,
  IS_IOS,
};

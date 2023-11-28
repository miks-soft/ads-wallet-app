import React, { ReactNode } from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// eslint-disable-next-line no-restricted-imports
import Animated, {
  SlideInDown,
  FadeOut,
  SlideOutDown,
  FadeIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '#ui-kit';

import { IS_IOS, SAFE_ZONE_BOTTOM } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import AvoidKeyboard from './AvoidKeyboard';
import FocusAwareStatusBar from './FocusAwareStatusBar';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export interface IModalWrapper {
  visible: boolean;
  setVisible: (value: boolean) => void;
  contentContainerStyle: StyleProp<ViewStyle>;
  containerStyle: StyleProp<ViewStyle>;
  children: ReactNode;
  transparent: boolean;
  animatedIn: boolean;
  style: StyleProp<ViewStyle>;
}

const ModalWrapper: React.FC<Partial<IModalWrapper>> = ({
  visible = false,
  animatedIn = true,
  setVisible = () => {},
  children,
  style = {},
  transparent = false,
  containerStyle = {},
  contentContainerStyle = {},
}) => {
  const colors = useColors();
  const closeModal = () => setVisible(false);
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets.bottom);

  return (
    <>
      {visible && (
        <View style={[styles.modal, StyleSheet.flatten(style)]}>
          <FocusAwareStatusBar barStyle="light-content" />
          <AnimatedTouchableOpacity
            activeOpacity={1}
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.backdrop, StyleSheet.absoluteFill]}
            onPress={() => setVisible(false)}
          />
          <AvoidKeyboard
            offset={IS_IOS ? SAFE_ZONE_BOTTOM : 0}
            style={styles.avoidKeyboardContainer}
          >
            <Animated.View
              entering={
                animatedIn ? SlideInDown.springify().mass(0.1) : undefined
              }
              exiting={SlideOutDown.springify().stiffness(0)}
              style={[
                styles.content,
                { backgroundColor: colors.white },
                containerStyle,
              ]}
            >
              {!transparent && (
                <>
                  <View
                    style={[styles.shape, { backgroundColor: colors.black }]}
                  />
                  <TouchableOpacity
                    style={styles.cross}
                    onPress={closeModal}
                  >
                    <Icon
                      color={colors.black}
                      name="close"
                      size={30}
                    />
                  </TouchableOpacity>
                </>
              )}
              <View style={[styles.innerContainer, contentContainerStyle]}>
                {children}
              </View>
            </Animated.View>
          </AvoidKeyboard>
        </View>
      )}
    </>
  );
};

const getStyles = (insetsBottom: number) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    // eslint-disable-next-line react-native/no-color-literals
    backdrop: {
      backgroundColor: '#00000099',
    },
    avoidKeyboardContainer: {
      maxHeight: '90%',
      justifyContent: 'flex-end',
    },
    content: {
      maxHeight: '100%',
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    innerContainer: {
      maxHeight: '100%',
      paddingTop: 20,
      paddingBottom: IS_IOS ? SAFE_ZONE_BOTTOM : insetsBottom,
      paddingHorizontal: 16,
    },
    shape: {
      height: 2,
      width: 32,
      alignSelf: 'center',
      position: 'absolute',
      marginTop: 8,
      marginBottom: 24,
      borderRadius: 2,
    },
    cross: {
      position: 'absolute',
      zIndex: 2,
      top: 16,
      right: 12,
    },
  });

export default React.memo(ModalWrapper);

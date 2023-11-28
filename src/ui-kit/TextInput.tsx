import React, { useEffect, useState, RefObject, ReactNode } from 'react';
import {
  TextInput as _TextInput,
  TouchableOpacity,
  View,
  TextInputProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import { useSelector } from '#hooks/redux';

// eslint-disable-next-line no-restricted-imports
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { DEFAULT_FONT_MAP, REGIONS } from '#config';

import { customAnimateTo, IS_IOS } from '#styles';
import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

import Icon from './Icon';

const LABEL_TRANSLATE_Y = -12;

export type ITextInputOutline = 'error' | 'success' | 'focused' | 'default';

export interface ITextInput
  extends Pick<
    TextInputProps,
    | 'value'
    | 'maxLength'
    | 'secureTextEntry'
    | 'placeholder'
    | 'autoCapitalize'
    | 'multiline'
    | 'keyboardType'
    | 'returnKeyType'
    | 'blurOnSubmit'
    | 'autoFocus'
    | 'showSoftInputOnFocus'
    | 'onFocus'
    | 'onBlur'
    | 'onSubmitEditing'
    | 'onContentSizeChange'
    | 'onEndEditing'
    | 'enablesReturnKeyAutomatically'
  > {
  size: 'default' | 'small';
  inputRef: RefObject<_TextInput>;
  IconRight: ReactNode;
  IconLeft: ReactNode;
  pointerEvents: TextInputProps['pointerEvents'];
  outlineType: ITextInputOutline;
  disabled: boolean;
  androidFixScrollMultiline: boolean;
  label: string;
  onChange: TextInputProps['onChangeText'];
  style: StyleProp<ViewStyle>;
  containerStyle: StyleProp<ViewStyle>;
  overrideColors: TextInputColorScheme;
}

const TextInput: React.FC<Partial<ITextInput>> = ({
  value = '',
  maxLength,
  multiline = false,
  pointerEvents = undefined,
  size = 'default',
  inputRef,
  outlineType,
  label = '',
  androidFixScrollMultiline = false,
  secureTextEntry = false,
  enablesReturnKeyAutomatically = false,
  IconRight,
  IconLeft,
  placeholder = '',
  autoCapitalize = 'none',
  keyboardType = 'default',
  returnKeyType = 'default',
  disabled = false,
  blurOnSubmit = false,
  autoFocus = false,
  showSoftInputOnFocus = true,
  onFocus = () => {},
  onBlur = () => {},
  onChange = () => {},
  onSubmitEditing = () => {},
  onContentSizeChange = () => {},
  onEndEditing = () => {},
  style = {},
  containerStyle = {},
  overrideColors,
}) => {
  const _multiline = multiline || (!IS_IOS && androidFixScrollMultiline);
  const colorScheme = useComponentsColors('TextInput', overrideColors);
  const [isFocused, setIsFocused] = useState(autoFocus);
  const region = useSelector(store => store.app.region);
  const styles = getStyles({
    outlineType: outlineType ? outlineType : isFocused ? 'focused' : 'default',
    label,
    disabled,
    size,
    multiline: _multiline,
    colorScheme,
    region,
  });

  const hasDisplayableValue = value || placeholder;

  const labelProgress = useSharedValue(hasDisplayableValue ? 1 : 0);

  const animatePlaceholder = (focus = false) => {
    if (hasDisplayableValue && !focus) {
      return;
    }

    customAnimateTo(labelProgress, focus ? 1 : 0);
  };

  const rLabelStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          labelProgress.value,
          [0, 1],
          [0, LABEL_TRANSLATE_Y],
        ),
      },
    ],
  }));

  const rLabelWrapperStyles = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(labelProgress.value, [0, 1], [1, 0.9]),
      },
    ],
  }));

  const renderNoPointerEventsWrapperAndroid = (children: ReactNode) =>
    !IS_IOS && pointerEvents === 'none' ? (
      <View
        pointerEvents="none"
        style={styles.wrapper}
      >
        {children}
      </View>
    ) : (
      <>{children}</>
    );

  useEffect(() => {
    animatePlaceholder(isFocused ? true : !!value);
  }, [value]);

  return (
    <View style={[styles.container, containerStyle]}>
      {IconLeft && (
        <View style={[styles.iconLeft, styles.iconContainer]}>{IconLeft}</View>
      )}

      {!!label && (
        <Animated.View
          pointerEvents="none"
          style={[styles.labelWrapper, rLabelWrapperStyles]}
        >
          <Animated.Text style={[styles.label, rLabelStyles]}>
            {label}
          </Animated.Text>
        </Animated.View>
      )}

      {renderNoPointerEventsWrapperAndroid(
        <_TextInput
          ref={inputRef}
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
          blurOnSubmit={blurOnSubmit}
          editable={!disabled}
          enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline || (!IS_IOS && androidFixScrollMultiline)}
          placeholder={placeholder}
          placeholderTextColor={colorScheme.placeholder}
          pointerEvents={pointerEvents}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          selectionColor={colorScheme.selection}
          showSoftInputOnFocus={showSoftInputOnFocus}
          style={[styles.input, StyleSheet.flatten(style)]}
          value={value}
          onBlur={e => {
            onBlur(e);
            setIsFocused(false);
            animatePlaceholder(false);
          }}
          onChangeText={onChange}
          onContentSizeChange={onContentSizeChange}
          onEndEditing={onEndEditing}
          onFocus={e => {
            onFocus(e);
            setIsFocused(true);
            animatePlaceholder(true);
          }}
          onSubmitEditing={onSubmitEditing}
        />,
      )}

      {IconRight ? (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.iconRight, styles.iconContainer]}
        >
          {IconRight}
        </Animated.View>
      ) : (
        !!value &&
        !disabled &&
        isFocused && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.iconRight, styles.iconContainer]}
          >
            <TouchableOpacity
              onPress={() => {
                onChange('');
              }}
            >
              <Icon name="close" />
            </TouchableOpacity>
          </Animated.View>
        )
      )}
    </View>
  );
};

export const getTextInputColorScheme = (colors: Colors) => ({
  borderColors: {
    default: colors.grayscale.__35,
    focused: colors.primary.normal,
    error: colors.error.classic,
    success: colors.success,
  },
  background: colors.white,
  label: colors.grayscale.__3,
  inputValue: colors.black,
  inputValueDisabled: colors.grayscale.__2,
  selection: colors.primary.normal,
  placeholder: colors.grayscale.__3,
});

type TextInputColorScheme = ReturnType<typeof getTextInputColorScheme>;

const getStyles = ({
  outlineType,
  label,
  disabled,
  size,
  multiline,
  colorScheme,
  region,
}: {
  outlineType: ITextInputOutline;
  label: string;
  disabled: boolean;
  size: ITextInput['size'];
  multiline: ITextInput['multiline'];
  colorScheme: TextInputColorScheme;
  region: REGIONS;
}) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 4,
      borderColor: colorScheme.borderColors[outlineType],
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: colorScheme.background,
    },
    wrapper: {
      flex: 1,
    },
    labelWrapper: {
      justifyContent: 'center',
    },
    label: {
      position: 'absolute',
      top: size === 'small' ? 12 : 18,
      left: size === 'small' ? 9 : 13,
      color: colorScheme.label,
      fontSize: 16,
      fontFamily: DEFAULT_FONT_MAP[region],
    },
    input: {
      flex: 1,
      height: multiline ? 'auto' : size === 'small' ? 44 : 56,
      maxHeight: 300,
      minHeight: multiline ? (size === 'small' ? 44 : 56) : 'auto',
      paddingTop: size === 'small' ? (label ? 20 : 8) : label ? 28 : 20,
      paddingBottom: size === 'small' ? (label ? 4 : 14) : label ? 8 : 18,
      paddingHorizontal: size === 'small' ? 8 : 12,
      color: disabled ? colorScheme.inputValueDisabled : colorScheme.inputValue,
      fontSize: 16,
      lineHeight: 18,
      fontFamily: DEFAULT_FONT_MAP[region],
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconLeft: {
      paddingLeft: size === 'small' ? 8 : 12,
    },
    iconRight: {
      paddingRight: size === 'small' ? 8 : 12,
    },
  });

export default TextInput;

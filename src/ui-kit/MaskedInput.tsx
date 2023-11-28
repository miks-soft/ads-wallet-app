import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

import MaskInput from 'react-native-mask-input';
// eslint-disable-next-line no-restricted-imports
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { customAnimateTo } from '#styles';
import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

import Icon from './Icon';
import { ITextInput, ITextInputOutline } from './TextInput';

const LABEL_TRANSLATE_Y = -12;

interface IMaskedInput extends Omit<ITextInput, 'onChange' | 'overrideColors'> {
  mask: (RegExp | string)[];
  onChange: (masked: string, unmasked: string) => void;
  overrideColors: MaskedInputColorScheme;
}

const MaskedInput: React.FC<Partial<IMaskedInput>> = ({
  value = '',
  maxLength,
  multiline = false,
  inputRef,
  outlineType,
  label = '',
  secureTextEntry = false,
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
  enablesReturnKeyAutomatically = false,
  mask = [],
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
  const [isFocused, setIsFocused] = useState(autoFocus);
  const colorScheme = useComponentsColors('MaskedInput', overrideColors);

  const styles = getStyles({
    outlineType: outlineType ? outlineType : isFocused ? 'focused' : 'default',
    label,
    colorScheme,
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

  useEffect(() => {
    !!value && animatePlaceholder(true);
  }, [!!value]);

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

      <MaskInput
        ref={inputRef}
        autoCapitalize={autoCapitalize}
        autoFocus={autoFocus}
        blurOnSubmit={blurOnSubmit}
        editable={!disabled}
        enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
        keyboardType={keyboardType}
        mask={mask}
        maxLength={maxLength}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colorScheme.placeholder}
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
      />

      {IconRight
        ? IconRight
        : !!value &&
          !disabled &&
          isFocused && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[styles.iconRight, styles.iconContainer]}
            >
              <TouchableOpacity
                onPress={() => {
                  onChange('', '');
                }}
              >
                <Icon name="close" />
              </TouchableOpacity>
            </Animated.View>
          )}
    </View>
  );
};

export const getMaskedInputColorScheme = (colors: Colors) => ({
  borderColors: {
    default: colors.grayscale.__35,
    focused: colors.primary.normal,
    error: colors.error.classic,
    success: colors.success,
  },
  background: colors.white,
  label: colors.grayscale.__3,
  inputValue: colors.black,
  selection: colors.primary.normal,
  placeholder: colors.grayscale.__3,
});

type MaskedInputColorScheme = ReturnType<typeof getMaskedInputColorScheme>;

const getStyles = ({
  outlineType,
  label,
  colorScheme,
}: {
  outlineType: ITextInputOutline;
  label: string;
  colorScheme: MaskedInputColorScheme;
}) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 4,
      borderColor: colorScheme.borderColors[outlineType],
      borderWidth: 1,
      borderRadius: 2,
      backgroundColor: colorScheme.background,
    },
    labelWrapper: {
      justifyContent: 'center',
    },
    label: {
      position: 'absolute',
      left: 13,
      color: colorScheme.label,
      fontSize: 16,
    },
    input: {
      flex: 1,
      height: 56,
      paddingTop: label ? 28 : 20,
      paddingBottom: label ? 8 : 18,
      paddingHorizontal: 12,
      color: colorScheme.inputValue,
      fontSize: 16,
      lineHeight: 18,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconLeft: {
      paddingLeft: 12,
    },
    iconRight: {
      paddingRight: 12,
    },
  });

export default React.memo(MaskedInput);

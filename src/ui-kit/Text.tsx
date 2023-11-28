import React, { ReactNode } from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';

import { useSelector } from '#hooks/redux';

import { REGIONS } from '#config';

import { useColors } from '#styles/theme/ColorsContext';

export interface IText {
  weight: '900' | '700' | '500' | '400' | '300' | '100';
  italic: boolean;
  size: number;
  lineHeight: number;
  numberOfLines: number;
  color: string;
  selectable: boolean;
  textAlign: TextStyle['textAlign'];
  onPress: () => void;
  children: text | ReactNode;
  style: StyleProp<TextStyle>;
}

const _Text: React.FC<Partial<IText>> = ({
  size = 16,
  weight = '400',
  color,
  italic = false,
  lineHeight = 24,
  numberOfLines = undefined,
  textAlign = 'auto',
  children,
  selectable = false,
  onPress = undefined,
  style = {},
}) => {
  const colors = useColors();
  const region = useSelector(store => store.app.region);
  const styles = getStyles({
    size,
    weight,
    color: color || colors.black,
    lineHeight,
    textAlign,
    italic,
    region,
  });

  return (
    <Text
      numberOfLines={numberOfLines}
      selectable={selectable}
      style={[styles.text, StyleSheet.flatten(style)]}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

const fontNameMap = {
  RU: {
    '900': {
      regualar: 'Roboto-Black',
      italic: 'Roboto-BlackItalic',
    },
    '700': {
      regualar: 'Roboto-Bold',
      italic: 'Roboto-BoldItalic',
    },
    '500': {
      regualar: 'Roboto-Medium',
      italic: 'Roboto-MediumItalic',
    },
    '400': {
      regualar: 'Roboto-Regular',
      italic: 'Roboto-Italic',
    },
    '300': {
      regualar: 'Roboto-Light',
      italic: 'Roboto-LightItalic',
    },
    '100': {
      regualar: 'Roboto-Thin',
      italic: 'Roboto-ThinItalic',
    },
  },
  USA: {
    '900': {
      regualar: 'Gilroy-Black',
      italic: 'Gilroy-BlackItalic',
    },
    '700': {
      regualar: 'Gilroy-Bold',
      italic: 'Gilroy-BoldItalic',
    },
    '500': {
      regualar: 'Gilroy-Medium',
      italic: 'Gilroy-MediumItalic',
    },
    '400': {
      regualar: 'Gilroy-Regular',
      italic: 'Gilroy-Italic',
    },
    '300': {
      regualar: 'Gilroy-Light',
      italic: 'Gilroy-LightItalic',
    },
    '100': {
      regualar: 'Gilroy-Thin',
      italic: 'Gilroy-ThinItalic',
    },
  },
};

const getStyles = ({
  size,
  weight,
  color,
  lineHeight,
  textAlign,
  italic,
  region,
}: Pick<
  IText,
  'size' | 'weight' | 'color' | 'lineHeight' | 'textAlign' | 'italic'
> & { region: REGIONS }) =>
  StyleSheet.create({
    text: {
      color,
      fontSize: size,
      textAlign,
      fontFamily: italic
        ? fontNameMap[region][weight].italic
        : fontNameMap[region][weight].regualar,
      lineHeight,
    },
  });

export const H1 = (props: Partial<IText>) => (
  <_Text
    {...props}
    size={24}
    weight="500"
  />
);

export const H2 = (props: Partial<IText>) => (
  <_Text
    size={20}
    weight="700"
    {...props}
  />
);

export const H3 = (props: Partial<IText>) => (
  <_Text
    size={18}
    weight="500"
    {...props}
  />
);

export const H4 = (props: Partial<IText>) => (
  <_Text
    lineHeight={20}
    size={14}
    {...props}
  />
);

export const H5 = (props: Partial<IText>) => (
  <_Text
    lineHeight={16}
    size={12}
    {...props}
  />
);

export default React.memo(_Text);

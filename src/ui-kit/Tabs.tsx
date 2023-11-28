import React, { Key, ReactNode } from 'react';
import { StyleProp, ViewStyle, View, StyleSheet } from 'react-native';

import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import Button, { IButton } from './Button';

export interface ITabs<U extends unknown> {
  data: U[];
  renderItem: (item: U) => ReactNode;
  keyExtractor?: (item: U) => Key;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface ITab<U extends unknown> {
  value: U;
  size: IButton['size'];
  displayValue?: string;
  isActive?: boolean;
  onChange: (value: U) => void;
}

const defaultKeyExtractor = (item: any) => item;

const Tabs = <U extends unknown>({
  data,
  renderItem,
  keyExtractor = defaultKeyExtractor,
  containerStyle,
}: ITabs<U>) => {
  const colors = useColors();
  const styles = getStyles(colors);
  return (
    <View style={[styles.container, StyleSheet.flatten(containerStyle)]}>
      {data.map(el => (
        <View
          key={keyExtractor(el)}
          style={styles.wrapper}
        >
          {renderItem(el)}
        </View>
      ))}
    </View>
  );
};

Tabs.Tab = <U,>({
  isActive,
  value,
  size = 'extra-small',
  displayValue = value as string,
  onChange,
}: Partial<ITab<U>>) => (
  <Button
    fullwidth={false}
    size={size}
    style={tabStyle}
    type={isActive ? 'primary' : 'secondary'}
    onPress={() => onChange && onChange(value!)}
  >
    {displayValue}
  </Button>
);

const tabStyle = {
  flex: 1,
  borderRadius: 0,
  borderWidth: 0,
};
const getStyles = (color: Colors) =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: color.primary.normal,
      borderRadius: 32,
    },
    wrapper: {
      flex: 1,
    },
  });

export default Tabs;

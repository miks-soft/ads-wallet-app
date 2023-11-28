import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import LayoutAdaptor from '#services/LayoutAdaptor';

import { H1, H4 } from './Text';

export interface INoDataError {
  title: string;
  subtitle: string;
  onPress: () => void;
}

const NoDataError: React.FC<Partial<INoDataError>> = ({
  title = '',
  subtitle,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
      >
        {title && <H1 textAlign="center">{title}</H1>}

        {subtitle && (
          <H4
            style={styles.subtitle}
            textAlign="center"
          >
            {subtitle}
          </H4>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: LayoutAdaptor.h(36, 15),
    paddingHorizontal: 16,
  },
  subtitle: {
    marginTop: 8,
  },
});

export default NoDataError;

import React from 'react';
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
} from 'react-native';

import { IS_IOS } from '#styles';
import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

const ACTIVITY_INDICATOR_IOS_DEFAULT_COLOR = '#999999';

export interface ILoader extends ActivityIndicatorProps {
  fullscreen: boolean;
  inverted: boolean;
  overrideColors: LoaderColorScheme;
}

const Loader: React.FC<Partial<ILoader>> = props => {
  const { fullscreen = false, inverted = false, style, overrideColors } = props;

  const colorScheme = useComponentsColors('Loader', overrideColors);
  const styles = getStyles({ fullscreen });

  return (
    <ActivityIndicator
      color={
        !inverted
          ? IS_IOS
            ? colorScheme.iosColor
            : colorScheme.androidColor
          : colorScheme.invertedColor
      }
      {...props}
      style={[styles.container, StyleSheet.flatten(style)]}
    />
  );
};
export const getLoaderColorScheme = (colors: Colors) => ({
  invertedColor: colors.white,
  iosColor: ACTIVITY_INDICATOR_IOS_DEFAULT_COLOR,
  androidColor: colors.primary.normal,
});

type LoaderColorScheme = ReturnType<typeof getLoaderColorScheme>;

const getStyles = ({ fullscreen }: Pick<ILoader, 'fullscreen'>) =>
  StyleSheet.create({
    container: {
      flex: fullscreen ? 1 : 0,
      width: fullscreen ? '100%' : 'auto',
    },
  });

export default React.memo(Loader);

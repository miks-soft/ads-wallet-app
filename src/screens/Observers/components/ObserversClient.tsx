import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Icon } from '#ui-kit';
import { H3, H4 } from '#ui-kit/Text';

import { shadow } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOObserverClient } from '#generated/types';

interface IObserversClient {
  item: Omit<DTOObserverClient, 'id' | 'account_id'>;
  onDelete?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const ObserversClient: React.FC<IObserversClient> = ({
  containerStyle,
  item,
  onDelete,
}) => {
  const colors = useColors();
  const styles = getStyles(colors);
  return (
    <View style={[styles.container, shadow.style, containerStyle]}>
      <View style={styles.wrapFix}>
        <H3 style={styles.name}>{item.name.replaceAll('<br />', '\n')}</H3>
        <H4
          color={colors.grayscale.__1}
          style={styles.name}
        >
          {item.account_name.replaceAll('<br />', '\n')}
        </H4>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <Icon name="close" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    name: {
      marginBottom: 4,
    },
    wrapFix: {
      flex: 1,
    },
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.grayscale.__5,
      borderRadius: 8,
      backgroundColor: colors.white,
    },
  });

export default ObserversClient;

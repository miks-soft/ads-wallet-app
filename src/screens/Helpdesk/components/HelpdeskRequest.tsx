import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

import Text from '#ui-kit/Text';

import { ENUMS } from '#localization';

import DateFormatter from '#services/formatters/Date';

import {
  HelpdeskRequestStatuses,
  MapHelpdeskRequestStatusesColor,
} from '#config/enums';

import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOHelpdeskRequest } from '#generated/types';

const HelpdeskRequest: React.FC<
  Partial<{
    containerStyle: StyleProp<ViewStyle>;
    item: DTOHelpdeskRequest;
    onPress: () => void;
  }>
> = ({ containerStyle, item, onPress = () => {} }) => {
  const colors = useColors();
  const styles = getStyles(colors);

  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <Text
              color={
                MapHelpdeskRequestStatusesColor[
                  item?.status as HelpdeskRequestStatuses
                ]
              }
              weight="300"
            >
              {
                ENUMS.HelpdeskRequestStatuses[
                  item?.status as HelpdeskRequestStatuses
                ]
              }
            </Text>
            <Text>{DateFormatter.humanize(item?.updated_at)}</Text>
          </View>

          {/*@ts-expect-error todo fix docs */}
          <Text>{item?.source_id!}</Text>

          <Text>
            {item?.theme.name}: <Text weight="500">{item?.name}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      padding: 16,
      backgroundColor: colors.white,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });

export default React.memo(HelpdeskRequest);

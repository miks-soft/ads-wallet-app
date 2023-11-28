import React, { useState } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

import { VictoryPie } from 'victory-native';

import {
  AllAdvertisingServices,
  MapAllAdvertisingServicesColor,
} from '#config/enums';

import { IS_IOS, SCREEN_WIDTH } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

const DonutChartServiceSpents: React.FC<{
  data?: {
    [key in AllAdvertisingServices]: string | number;
  };
  isNoDataAvailable: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  approxWidth?: number;
}> = ({
  containerStyle,
  data,
  approxWidth = (SCREEN_WIDTH - 32) * 0.45,
  isNoDataAvailable,
}) => {
  const colors = useColors();
  const [width, setWidth] = useState(approxWidth);
  const _data =
    !isNoDataAvailable && data
      ? Object.entries(data).map(([key, value]) => ({
          y: value ? +value : undefined,
          color: MapAllAdvertisingServicesColor[key as AllAdvertisingServices],
        }))
      : [
          {
            y: 2,
            color: colors.grayscale.__6,
          },
          {
            y: 5,
            color: colors.grayscale.__4,
          },
          {
            y: 3,
            color: colors.grayscale.__2,
          },
          {
            y: 8,
            color: colors.grayscale.__1,
          },
        ];

  return (
    <View
      style={containerStyle}
      onLayout={e => {
        setWidth(e.nativeEvent.layout.width);
      }}
    >
      <VictoryPie
        animate={
          IS_IOS
            ? {
                duration: 500,
                easing: 'backInOut',
              }
            : undefined
        }
        data={_data}
        height={width}
        innerRadius={width / 2.5}
        labels={() => ''}
        style={{
          data: {
            fill: ({ datum }) => datum.color,
          },
        }}
        width={width}
      />
    </View>
  );
};

export default DonutChartServiceSpents;

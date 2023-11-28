import React, { useState } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLegend,
  VictoryScatter,
  VictoryTheme,
} from 'victory-native';

import { ENUMS } from '#localization';

import DateFormatter from '#services/formatters/Date';
import DenominationFormatter from '#services/formatters/Denomination';

import {
  AllAdvertisingServices,
  MapAllAdvertisingServicesColor,
} from '#config/enums';

import { SCREEN_WIDTH } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOChart } from '#generated/types';

const GroupChartServiceSpents: React.FC<{
  data: Record<AllAdvertisingServices, DTOChart[]>;
  containerStyle?: StyleProp<ViewStyle>;
  approxWidth?: number;
}> = ({ containerStyle, data, approxWidth = SCREEN_WIDTH }) => {
  const colors = useColors();
  const [width, setWidth] = useState(approxWidth);
  return (
    <View
      style={containerStyle}
      onLayout={e => {
        setWidth(e.nativeEvent.layout.width);
      }}
    >
      <VictoryChart
        height={width}
        padding={{
          right: 20,
          left: 44,
          top: 8,
          bottom: 60,
        }}
        theme={VictoryTheme.material}
        width={width}
      >
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: {
              fontSize: 11,
              padding: 4.5,
              fontWeight: 'bold',
            },
          }}
          tickFormat={DenominationFormatter.format}
        />
        <VictoryAxis
          style={{
            tickLabels: {
              fontSize: 10,
            },
          }}
          tickFormat={DateFormatter.humanizeDate}
          tickLabelComponent={
            <VictoryLabel
              angle={-40}
              dx={-20}
              dy={0}
            />
          }
        />

        {Object.entries(data).map(([service, stats]) => (
          <VictoryGroup
            key={service}
            data={stats.map(el => {
              const [year, month, day] = el.for_date.split('-');
              return {
                x: new Date(+year, +month - 1, +day),
                y: +el.spent,
              };
            })}
            style={{
              data: { strokeWidth: 3, fillOpacity: 0.2 },
            }}
          >
            <VictoryArea
              interpolation="catmullRom"
              style={{
                data: {
                  fill: MapAllAdvertisingServicesColor[
                    service as AllAdvertisingServices
                  ],
                  stroke:
                    MapAllAdvertisingServicesColor[
                      service as AllAdvertisingServices
                    ],
                },
              }}
            />
            <VictoryScatter
              size={() => {
                return stats.length === 1 ? 7 : 2.5;
              }}
              style={{
                data: {
                  fill: colors.white,
                  stroke:
                    MapAllAdvertisingServicesColor[
                      service as AllAdvertisingServices
                    ],
                  fillOpacity: 1,
                  strokeWidth: stats.length === 1 ? 3 : 1.5,
                },
              }}
            />
          </VictoryGroup>
        ))}

        <VictoryLegend
          colorScale={Object.values(AllAdvertisingServices).map(
            el => MapAllAdvertisingServicesColor[el],
          )}
          data={Object.values(AllAdvertisingServices).map(el => ({
            name: ENUMS.Services[el],
          }))}
          gutter={20}
          style={{
            border: { stroke: 'black' },
          }}
          x={55}
          y={5}
        />
      </VictoryChart>
    </View>
  );
};

export default React.memo(GroupChartServiceSpents);

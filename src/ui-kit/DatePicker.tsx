import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

import { NavigationProp, useNavigation } from '@react-navigation/native';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppParamList, AppRoutes } from '#navigation/types';

import DateFormatter from '#services/formatters/Date';

import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

import Icon from './Icon';
import TextInput from './TextInput';

export interface IDatePicker {
  onSet?: (value?: Date) => void;
  date?: Date;
  clearable: boolean;
  containerStyle: StyleProp<ViewStyle>;
  maximumDate?: Date;
  minimumDate?: Date;
  inputContainerStyle: StyleProp<ViewStyle>;
  label: string;
  disabled: boolean;
  overrideColors: DatePickerColorScheme;
}

const DatePicker: React.FC<Partial<IDatePicker>> = ({
  date,
  maximumDate,
  minimumDate,
  onSet = () => {},
  containerStyle,
  clearable = true,
  inputContainerStyle,
  disabled = false,
  label = '',
  overrideColors,
}) => {
  const colors = useComponentsColors('DatePicker', overrideColors);
  const navigation = useNavigation<NavigationProp<AppParamList>>();

  return (
    <TouchableOpacity
      disabled={disabled}
      style={containerStyle}
      onPress={() => {
        navigation.navigate(AppRoutes.Modals, {
          screen: ModalsRoutes.DatePicker,
          params: {
            date: date || new Date(),
            onConfirm: onSet,
            maximumDate: maximumDate,
            minimumDate: minimumDate,
          },
        });
      }}
    >
      <TextInput
        containerStyle={inputContainerStyle}
        disabled={disabled}
        IconRight={
          clearable ? (
            <TouchableOpacity onPress={() => onSet(undefined)}>
              <Icon name="close" />
            </TouchableOpacity>
          ) : (
            <Icon
              color={colors.placeholderIcon}
              name="calendar-today"
              size={16}
            />
          )
        }
        label={label}
        pointerEvents="none"
        size="small"
        value={date ? DateFormatter.formatDateWithDots(date) : ''}
      />
    </TouchableOpacity>
  );
};

export const getDatePickerColorScheme = (colors: Colors) => ({
  placeholderIcon: colors.grayscale.__2,
});

type DatePickerColorScheme = ReturnType<typeof getDatePickerColorScheme>;

export default DatePicker;

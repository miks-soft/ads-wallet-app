import { getButtonColorScheme } from '#ui-kit/Button';
import { getCheckboxColorScheme } from '#ui-kit/Checkbox';
import { getDatePickerColorScheme } from '#ui-kit/DatePicker';
import { getHeaderColorScheme } from '#ui-kit/Header';
import { getLoaderColorScheme } from '#ui-kit/Loader';
import { getMaskedInputColorScheme } from '#ui-kit/MaskedInput';
import { getRadioColorScheme } from '#ui-kit/Radio';
import { getSelectableCardColorScheme } from '#ui-kit/SelectableCard';
import { getTextInputColorScheme } from '#ui-kit/TextInput';

import { getAttachmentColorScheme } from '#components/Attachment';
import { getBottomTabColorScheme } from '#components/BottomTabBar/BottomTab';
import { getMessageAttachmentColorScheme } from '#components/Message/Attachment';

export const RU_colors = {
  primary: {
    normal: '#395FE4',
    pale: '#9CAFF1',
    light: '#D6E0F2',
  },
  white: '#FFFFFF',
  black: '#333333',
  grayscale: {
    __1: '#7F858D',
    __2: '#9BA2AB',
    __3: '#BFC2C6',
    __35: '#D1D4D8',
    __4: '#DADEE6',
    __5: '#E6EAF2',
    __55: '#EDEFF3',
    __6: '#F5F7FA',
    __7: '#FBFCFF',
  },
  error: {
    classic: '#B73339',
    light: '#EB5757',
    lightest: '#ffeded',
  },
  BG: {
    __1: '#FCFCFE',
    __2: '#F3F6FB',
    grey: '#00000028',
  },
  warning: {
    light: '#FFF0C2',
    classic: '#FFE55C',
  },
  orange: '#FF974C',
  success: '#27AE60',
  transparent: '#00000000',
};

export const USA_colors = {
  primary: {
    normal: '#FF7F50',
    pale: '#FFA75C',
    light: '#FFD7AC',
  },
  white: '#FBFFFF',
  black: '#000000',
  grayscale: {
    __1: '#8F857D',
    __2: '#ABA29B',
    __3: '#CFC2B6',
    __35: '#D1D4C8',
    __4: '#DADED1',
    __5: '#F1DFD2',
    __55: '#F9EFE2',
    __6: '#FAF7F5',
    __7: '#FBFCFF',
  },
  error: {
    classic: '#B73339',
    light: '#EB5757',
    lightest: '#ffeded',
  },
  BG: {
    __1: '#FCFCFE',
    __2: '#F3F6FB',
    grey: '#00000028',
  },
  warning: {
    light: '#FFF0C2',
    classic: '#FFE55C',
  },
  orange: '#FF974C',
  success: '#27AE60',
  transparent: '#00000000',
};

export type Colors = typeof RU_colors;

export const defaultColors: Colors = RU_colors;

export type AppComponentsColors = ReturnType<typeof getAppComponentColors>;

export const getAppComponentColors = (colors = defaultColors) => ({
  Button: getButtonColorScheme(colors),
  Checkbox: getCheckboxColorScheme(colors),
  DatePicker: getDatePickerColorScheme(colors),
  Header: getHeaderColorScheme(colors),
  Loader: getLoaderColorScheme(colors),
  MaskedInput: getMaskedInputColorScheme(colors),
  TextInput: getTextInputColorScheme(colors),
  Radio: getRadioColorScheme(colors),
  SelectableCard: getSelectableCardColorScheme(colors),

  Attachment: getAttachmentColorScheme(colors),
  BottomTab: getBottomTabColorScheme(colors),
  MessageAttachemnt: getMessageAttachmentColorScheme(colors),
});

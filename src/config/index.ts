import { __DEVELOPMENT__ } from '#env';

import { CurrencyMap } from './enums';

export const RUSSIAN_PHONE_MASK = [
  '+',
  '7',
  ' ',
  '(',
  /\d/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
];

export const USA_PHONE_MASK = [
  '+',
  '1',
  ' ',
  '(',
  /\d/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const __DEVELOPER__ = __DEVELOPMENT__;
export type REGIONS = 'USA' | 'RU';

export const DEFAULT_FONT_MAP: { [key in REGIONS]: string } = {
  USA: 'Gilroy-Regular',
  RU: 'Roboto-Regular',
};

export const APP_CURRENCY_MAP: { [key in REGIONS]: CurrencyMap } = {
  USA: 'USD' as CurrencyMap,
  RU: 'RUB' as CurrencyMap,
};

export const DEV_BASE_URL: { [key in REGIONS]: string } = {
  USA: 'https://api.digital-eagle.us/api/v1',
  RU: 'http://84.201.148.172:8081/api/v1',
};

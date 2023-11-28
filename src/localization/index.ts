import LocalizedStrings from 'react-native-localization';

import { EN_ENUMS, EN_STRINGS } from './en';
import { RU_STRINGS, RU_ENUMS } from './ru';

export type LocalizationDictionary = typeof RU_STRINGS;

export let STRINGS = new LocalizedStrings({
  ru: RU_STRINGS,
  en: EN_STRINGS,
});

export let ENUMS = new LocalizedStrings({
  ru: RU_ENUMS,
  en: EN_ENUMS,
});

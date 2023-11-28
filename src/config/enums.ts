import { IconNames } from '#ui-kit/Icon';

import { defaultColors } from '#styles/theme';

import Images from './images';

/* Shared on BE and FE */
export enum DocumentsDeliveryTypes {
  'IN_OFFICE' = 'in_office',
  'COURIER' = 'by_email',
}

export enum CurrencyMap {
  'USD' = '$',
  'RUB' = '₽',

  '$' = 'USD',
  '₽' = 'RUB',
}

export enum ReceiptDeliveryTypes {
  'EMAIL' = 'mail',
  'SMS' = 'phone',
}

//TODO unify advertising services
export enum AllAdvertisingServices {
  'VK' = 'vkontakte',
  'MyTarget' = 'mytarget',
  'Yandex' = 'yandex',
  'Google' = 'google',
  'VKAds' = 'vkads',
}

export const MapAllAdvertisingServicesColor: {
  [key in AllAdvertisingServices]: string;
} = {
  [AllAdvertisingServices.VK]: '#54729b',
  [AllAdvertisingServices.VKAds]: '#2d81e0',
  [AllAdvertisingServices.Yandex]: '#fc3',
  [AllAdvertisingServices.MyTarget]: 'rgb(252, 44, 56)',
  [AllAdvertisingServices.Google]: 'green',
};

export enum ImplementedAdvertisingServices {
  'VK' = 'vkontakte',
  'MyTarget' = 'mytarget',
  'Yandex' = 'yandex',
  'Google' = 'google',
  'VKAds' = 'vkads',
}

export const MapImplementedAdvertisingServicesLogo: {
  [key in ImplementedAdvertisingServices]: any;
} = {
  [ImplementedAdvertisingServices.Yandex]: Images.YandexLogo,
  [ImplementedAdvertisingServices.MyTarget]: Images.MyTargetLogo,
  [ImplementedAdvertisingServices.VK]: Images.VKLogo,
  [ImplementedAdvertisingServices.Google]: Images.GoogleAdsLogo,
  [ImplementedAdvertisingServices.VKAds]: Images.VKAdsLogo,
};

export const MapDocumentsDeliveryTypesText: {
  [key in DocumentsDeliveryTypes]: string;
} = {
  [DocumentsDeliveryTypes.COURIER]: 'Отправка почтой/курьерской службой',
  [DocumentsDeliveryTypes.IN_OFFICE]: 'ЭДО',
};

export const MapReceiptDeliveryTypesText: {
  [key in ReceiptDeliveryTypes]: string;
} = {
  [ReceiptDeliveryTypes.EMAIL]: 'На почту',
  [ReceiptDeliveryTypes.SMS]: 'По смс',
};

export enum AdvertisingAccountStatuses {
  'ACTIVE' = 'active',
  'CREATED' = 'created',
  'PENDING' = 'pending',
  'DECLINED' = 'declined',
  'DELETED' = 'deleted',
  'BLOCKED' = 'blocked',
}

export const MapAdvertisingAccountStatusesColor: {
  [key in AdvertisingAccountStatuses]: string;
} = {
  [AdvertisingAccountStatuses.ACTIVE]: defaultColors.success,
  [AdvertisingAccountStatuses.BLOCKED]: defaultColors.error.classic,
  [AdvertisingAccountStatuses.CREATED]: defaultColors.success,
  [AdvertisingAccountStatuses.DECLINED]: defaultColors.error.classic,
  [AdvertisingAccountStatuses.DELETED]: defaultColors.grayscale.__2,
  [AdvertisingAccountStatuses.PENDING]: defaultColors.grayscale.__2,
};

export enum SortDirections {
  'ASC' = 'asc',
  'DESC' = 'desc',
}

export const MapSortDirectionsIcons: {
  [key in SortDirections]: IconNames;
} = {
  [SortDirections.ASC]: 'asc',
  [SortDirections.DESC]: 'desc',
};

export enum HelpdeskRequestStatuses {
  'OPEN' = 1,
  'NEEDS_INFO' = 3,
  'ClOSED' = 4,
}

export const MapHelpdeskRequestStatusesColor: {
  [key in HelpdeskRequestStatuses]: string;
} = {
  [HelpdeskRequestStatuses.OPEN]: defaultColors.grayscale.__1,
  [HelpdeskRequestStatuses.ClOSED]: defaultColors.grayscale.__3,
  [HelpdeskRequestStatuses.NEEDS_INFO]: defaultColors.error.light,
};

/* FE only */

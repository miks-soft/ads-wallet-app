import { FastImageProps } from 'react-native-fast-image';

import Images from '#config/images';

export enum EventIdTypes {
  MONEY_TRANSFER = '2',
  WITHDRAW = '3',
  COMMISSION = '16',
  PENALTY = '4',
  REFUND = '12',
  REFUND_BONUSES = '13',
  REFUND_ADVERTISING_BALANCE = '14',
  REFUND_ADVERTISING_CASHBACK_BALANCE = '15',
  DEPOSIT = '1',
  DEPOSIT_MANUAL = '10',
  DEPOSIT_CASHBACK = '7',
  DEPOSIT_CASHBACK_MANUAL = '11',
  ADVERTISING = '5',
  ADVERTISING_CASHBACK = '8',
  CASHBACK = '6',
  CASHBACK_COMMISSION = '17',
  CASHBACK_DEPOSIT = '9',
}

export const MapBEEventFEEventIdType: {
  [key in string]: EventIdTypes;
} = {
  transfer: EventIdTypes.MONEY_TRANSFER,
  out: EventIdTypes.WITHDRAW,
  commission: EventIdTypes.COMMISSION,
  fine: EventIdTypes.PENALTY,
  refund: EventIdTypes.REFUND,
  'refund-to-bonus': EventIdTypes.REFUND_BONUSES,
  'transfer-from-acc-to-balance': EventIdTypes.REFUND_ADVERTISING_BALANCE,
  'transfer-from-acc-to-cashback-balance':
    EventIdTypes.REFUND_ADVERTISING_CASHBACK_BALANCE,
  add: EventIdTypes.DEPOSIT,
  'add-custom': EventIdTypes.DEPOSIT_MANUAL,
  'add-bonus': EventIdTypes.DEPOSIT_CASHBACK,
  'add-custom-cashback': EventIdTypes.DEPOSIT_CASHBACK_MANUAL,
  ad: EventIdTypes.ADVERTISING,
  cashback: EventIdTypes.CASHBACK,
  'commission-cashback': EventIdTypes.CASHBACK_COMMISSION,
};

export const MapEventIdTypesIcon: {
  [key in EventIdTypes]: FastImageProps['source'];
} = {
  [EventIdTypes.DEPOSIT]: Images.Transaction1,
  [EventIdTypes.MONEY_TRANSFER]: Images.Transaction2,
  [EventIdTypes.WITHDRAW]: Images.Transaction3,
  [EventIdTypes.PENALTY]: Images.Transaction4,
  [EventIdTypes.ADVERTISING]: Images.Transaction5,
  [EventIdTypes.CASHBACK]: Images.Transaction6,
  [EventIdTypes.DEPOSIT_CASHBACK]: Images.Transaction7,
  [EventIdTypes.ADVERTISING_CASHBACK]: Images.Transaction8,
  [EventIdTypes.CASHBACK_DEPOSIT]: Images.Transaction6,
  [EventIdTypes.DEPOSIT_MANUAL]: Images.Transaction10,
  [EventIdTypes.REFUND]: Images.Transaction9,
  [EventIdTypes.DEPOSIT_CASHBACK_MANUAL]: Images.Transaction12,
  [EventIdTypes.REFUND_BONUSES]: Images.Transaction13,
  [EventIdTypes.REFUND_ADVERTISING_BALANCE]: Images.Transaction9,
  [EventIdTypes.REFUND_ADVERTISING_CASHBACK_BALANCE]: Images.Transaction11,
  [EventIdTypes.COMMISSION]: Images.Transaction14,
  [EventIdTypes.CASHBACK_COMMISSION]: Images.Transaction15,
};

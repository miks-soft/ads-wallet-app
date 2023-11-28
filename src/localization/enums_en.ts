import { AdvertisingFilteringOptions } from '#screens/AdvertisingManagement/config';
import { EventIdTypes } from '#screens/Events/types';

import {
  AdvertisingAccountStatuses,
  DocumentsDeliveryTypes,
  HelpdeskRequestStatuses,
  ReceiptDeliveryTypes,
} from '#config/enums';

const MapAdvertisingAccountStatusesText: {
  [key in AdvertisingAccountStatuses]: string;
} = {
  [AdvertisingAccountStatuses.ACTIVE]: 'Active',
  [AdvertisingAccountStatuses.BLOCKED]: 'Blocked',
  [AdvertisingAccountStatuses.CREATED]: 'Created',
  [AdvertisingAccountStatuses.DECLINED]: 'Declined',
  [AdvertisingAccountStatuses.DELETED]: 'Deleted',
  [AdvertisingAccountStatuses.PENDING]: 'Pending',
};

const MapHelpdeskRequestStatusesText: {
  [key in HelpdeskRequestStatuses]: string;
} = {
  [HelpdeskRequestStatuses.OPEN]: 'OPEN',
  [HelpdeskRequestStatuses.ClOSED]: 'CLOSED',
  [HelpdeskRequestStatuses.NEEDS_INFO]: 'NEEDS_INFO',
};

const MapDocumentsDeliveryTypesText: {
  [key in DocumentsDeliveryTypes]: string;
} = {
  [DocumentsDeliveryTypes.COURIER]: 'By courier',
  [DocumentsDeliveryTypes.IN_OFFICE]: 'In office',
};

const MapReceiptDeliveryTypesText: {
  [key in ReceiptDeliveryTypes]: string;
} = {
  [ReceiptDeliveryTypes.EMAIL]: 'EMAIL',
  [ReceiptDeliveryTypes.SMS]: 'SMS',
};

const MapAdvertisingFilteringOptionsText: {
  [key in keyof typeof AdvertisingFilteringOptions]: string;
} = {
  [AdvertisingFilteringOptions.NAME]: 'Account name',
  [AdvertisingFilteringOptions.CREATED]: 'Created at',
  [AdvertisingFilteringOptions.BALANCE]: 'Balance',
  [AdvertisingFilteringOptions.SPENT]: 'Spent yesterday',
};

const MapEventIdTypesText: { [key in EventIdTypes]: string } = {
  [EventIdTypes.MONEY_TRANSFER]: 'Money transfer',
  [EventIdTypes.WITHDRAW]: 'Withdraw',
  [EventIdTypes.COMMISSION]: 'Commision',
  [EventIdTypes.PENALTY]: 'Penalty',
  [EventIdTypes.REFUND]: 'Refund',
  [EventIdTypes.REFUND_BONUSES]: 'Refund (to bonus account)',
  [EventIdTypes.REFUND_ADVERTISING_BALANCE]: 'Refund from AA to BA balance',
  [EventIdTypes.REFUND_ADVERTISING_CASHBACK_BALANCE]:
    'Regund from AA to BA cashback balance',
  [EventIdTypes.DEPOSIT]: 'Deposit',
  [EventIdTypes.DEPOSIT_MANUAL]: 'Manual deposit',
  [EventIdTypes.DEPOSIT_CASHBACK]: 'Deposit (from bonus account)',
  [EventIdTypes.DEPOSIT_CASHBACK_MANUAL]: 'Manual Cashback deposit',
  [EventIdTypes.ADVERTISING]: 'Advertising',
  [EventIdTypes.ADVERTISING_CASHBACK]: 'Advertising (from cashback balance)',
  [EventIdTypes.CASHBACK]: 'Cashback',
  [EventIdTypes.CASHBACK_COMMISSION]: 'Cashback from commission',
  [EventIdTypes.CASHBACK_DEPOSIT]: 'Cashback from deposit',
};

const MapDocTypeLocalization = {
  act: 'Act',
  invoice: 'Invoice',
};

export const ENUMS_EN = {
  DocType: MapDocTypeLocalization,
  EventIdTypes: MapEventIdTypesText,
  AdvertisingFilteringOptions: MapAdvertisingFilteringOptionsText,
  ReceiptDeliveryTypes: MapReceiptDeliveryTypesText,
  DocumentsDeliveryTypes: MapDocumentsDeliveryTypesText,
  HelpdeskRequestStatuses: MapHelpdeskRequestStatusesText,
  AdvertisingAccountStatuses: MapAdvertisingAccountStatusesText,
};

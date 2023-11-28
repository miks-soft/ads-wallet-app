import { AdvertisingFilteringOptions } from '#screens/AdvertisingManagement/config';
import { EventIdTypes } from '#screens/Events/types';

import {
  AdvertisingAccountStatuses,
  AllAdvertisingServices,
  DocumentsDeliveryTypes,
  HelpdeskRequestStatuses,
  ReceiptDeliveryTypes,
} from '#config/enums';

import enums from './enums.json';
import localization from './localization.json';

const MapAdvertisingAccountStatusesText: {
  [key in AdvertisingAccountStatuses]: string;
} = enums.AdvertisingAccountStatuses;

const MapHelpdeskRequestStatusesText: {
  [key in HelpdeskRequestStatuses]: string;
} = enums.HelpdeskRequestStatuses;

const MapDocumentsDeliveryTypesText: {
  [key in DocumentsDeliveryTypes]: string;
} = enums.DocumentsDeliveryTypes;

const MapReceiptDeliveryTypesText: {
  [key in ReceiptDeliveryTypes]: string;
} = enums.ReceiptDeliveryTypes;

const MapAdvertisingFilteringOptionsText: {
  [key in keyof typeof AdvertisingFilteringOptions]: string;
} = enums.AdvertisingFilteringOptions;

const MapEventIdTypesText: { [key in EventIdTypes]: string } =
  enums.EventIdTypes;

const MapDocTypeLocalization = enums.DocType;

const MapServicesLocalization: { [key in AllAdvertisingServices]: string } =
  enums.Services;

export const RU_ENUMS = {
  Services: MapServicesLocalization,
  DocType: MapDocTypeLocalization,
  EventIdTypes: MapEventIdTypesText,
  AdvertisingFilteringOptions: MapAdvertisingFilteringOptionsText,
  ReceiptDeliveryTypes: MapReceiptDeliveryTypesText,
  DocumentsDeliveryTypes: MapDocumentsDeliveryTypesText,
  HelpdeskRequestStatuses: MapHelpdeskRequestStatusesText,
  AdvertisingAccountStatuses: MapAdvertisingAccountStatusesText,
};

export const RU_STRINGS = localization;

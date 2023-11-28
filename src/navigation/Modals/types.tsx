import { Key } from 'react';
import { ViewStyle } from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';

import DatePicker from 'react-native-date-picker';

import { UIActionModalButton } from '#modals/utils/Actions/types';

import { ImplementedAdvertisingServices } from '#config/enums';

import { DTOAdvertAccount, DTOAdvertAccountCampaign } from '#generated/types';

export enum ModalsRoutes {
  ListBusinessAccounts = 'BusinessAccounts',
  ListAdvertisingAccounts = 'AdvertisingAccounts',
  CreateRefundAdvertisingAccountBalance = 'CreateRefundAdvertisingAccountBalance',
  CreateVkAccount = 'CreateVkAccount',
  CreateVkAdsAccount = 'CreateVkAdsAccount',
  CreateMyTargetAccount = 'CreateMyTargetAccount',
  CreateYandexAccount = 'CreateYandexAccount',
  CreateGoogleAccount = 'CreateGoogleAccount',
  CreateHelpdeskRequest = 'CreateHelpdeskRequest',
  EditAdvertisingCampaignLimit = 'ChangeAdvertisingCampaignLimit',
  Select = 'Select',
  List = 'List',
  RadioSelect = 'RadioSelect',
  Actions = 'Actions',
  Dialog = 'Dialog',
  'DatePicker' = 'DatePicker',
}

export type ModalsParamList = {
  [ModalsRoutes.ListBusinessAccounts]: undefined;
  [ModalsRoutes.ListAdvertisingAccounts]: {
    onSelect?: (value: DTOAdvertAccount) => void;
  };
  [ModalsRoutes.Dialog]: {
    title: string;
    text: string;
    confirmButtonProps: UIActionModalButton;
    declineButtonProps: UIActionModalButton;
  };
  [ModalsRoutes.EditAdvertisingCampaignLimit]: {
    account: DTOAdvertAccountCampaign;
    service: ImplementedAdvertisingServices;
    advertisingAccountId: string;
  };
  [ModalsRoutes.CreateHelpdeskRequest]: { onEnd?: () => void };
  [ModalsRoutes.DatePicker]: DatePicker['props'];
  [ModalsRoutes.Actions]: { buttons: UIActionModalButton[] };
  [ModalsRoutes.CreateRefundAdvertisingAccountBalance]: {
    account: DTOAdvertAccount;
  };
  [ModalsRoutes.CreateMyTargetAccount]: { onEnd?: () => void };
  [ModalsRoutes.CreateVkAccount]: { onEnd?: () => void };
  [ModalsRoutes.CreateVkAdsAccount]: { onEnd?: () => void };
  [ModalsRoutes.CreateYandexAccount]: { onEnd?: () => void };
  [ModalsRoutes.CreateGoogleAccount]: { onEnd?: () => void };
  [ModalsRoutes.Select]: {
    checkedExtractor: (item: any, currentItem: any, index: number) => boolean;
    keyExtractor: (item: any, index: number) => Key;
    data: unknown[];
    renderItem: (item: any, index: number) => JSX.Element;
    title: string;
    onSelectionEnd: (item: any) => void;
    isMultiple?: boolean;
    withCheckMark?: boolean;
    itemContainerStyle?: ViewStyle;
    defaultValue?: any;
  };
  [ModalsRoutes.List]: {
    keyExtractor: (item: any, index: number) => Key;
    data: unknown[];
    renderItem: (item: any, index: number) => JSX.Element;
    title: string;
    buttonProps: UIActionModalButton;
  };
  [ModalsRoutes.RadioSelect]: {
    checkedExtractor: (item: any, currentItem: any, index: number) => boolean;
    keyExtractor: (item: any, index: number) => Key;
    itemContainerStyle?: ViewStyle;
    data: unknown[];
    renderItem: (item: any, index: number) => JSX.Element;
    title: string;
    onSelectionEnd: (item?: any) => void;
    defaultValue?: any;
  };
};

export type ModalsScreenProps<RouteName extends ModalsRoutes> =
  StackScreenProps<ModalsParamList, RouteName>;

import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { ImplementedAdvertisingServices } from '#config/enums';

import { DTOHelpdeskRequest } from '#generated/types';

import { AuthParamList } from './Auth/types';
import { BusinessAccountParamList } from './BusinessAccount/types';
import { DepositParamList } from './Deposit/types';
import { MainParamList } from './Main/types';
import { ModalsParamList } from './Modals/types';
import { ObserversParamList } from './Observers/types';
import { RestorePasswordParamList } from './RestorePassword/types';

export enum AppRoutes {
  StackObservers = 'StackObservers',
  StackAuth = 'AuthStack',
  StackDeposit = 'DepositStack',
  StackRestorePassword = 'RestorePasswordStack',
  StackBusinessAccount = 'BusinessAccountStack',
  AddMyTargetAccountGuide = 'AddMyTargetAccountGuide',
  AddVKAdsAccountGuide = 'AddVKAdsAccountGuide',
  AdvertisingAccountCampaigns = 'AdvertisingAccountCampaigns',
  Main = 'Main',
  Modals = 'Modals',
  HelpdeskChat = 'HelpdeskChat',
  CashbackAndCommission = 'CashbackAndCommission',

  StubNoBusinessAccount = 'StubNoBusinessAccount',
  StubNotVerified = 'StubNotVerified',
}

export type AppParamList = {
  [AppRoutes.AdvertisingAccountCampaigns]: {
    advertisingAccountId: string;
    accountName: string;
    service: ImplementedAdvertisingServices;
  };
  [AppRoutes.StubNoBusinessAccount]: undefined;
  [AppRoutes.StubNotVerified]: undefined;
  [AppRoutes.HelpdeskChat]: {
    defaultHelpdeskRequest?: DTOHelpdeskRequest;
    helpdeskRequestId?: string;
  };
  [AppRoutes.CashbackAndCommission]: undefined;
  [AppRoutes.StackObservers]: NavigatorScreenParams<ObserversParamList>;
  [AppRoutes.StackRestorePassword]: NavigatorScreenParams<RestorePasswordParamList>;
  [AppRoutes.StackAuth]: NavigatorScreenParams<AuthParamList>;
  [AppRoutes.Main]: NavigatorScreenParams<MainParamList>;
  [AppRoutes.Modals]: NavigatorScreenParams<ModalsParamList>;
  [AppRoutes.StackBusinessAccount]: NavigatorScreenParams<BusinessAccountParamList>;
  [AppRoutes.StackDeposit]: NavigatorScreenParams<DepositParamList>;
  [AppRoutes.AddMyTargetAccountGuide]: undefined;
  [AppRoutes.AddVKAdsAccountGuide]: undefined;
};

export type AppScreenProps<RouteName extends AppRoutes> = StackScreenProps<
  AppParamList,
  RouteName
>;

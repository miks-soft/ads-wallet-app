import { StackScreenProps } from '@react-navigation/stack';

import { DTOAdvertAccount } from '#generated/types';

export enum DepositRoutes {
  'BusinessAccount' = 'DepositBusinessAccount',
  'AdvertisingAccount' = 'DepositAdvertisingAccount',
}

export type DepositParamList = {
  [DepositRoutes.BusinessAccount]: undefined;
  [DepositRoutes.AdvertisingAccount]: { defaultAccount?: DTOAdvertAccount };
};

export type DepositScreenProps<RouteName extends DepositRoutes> =
  StackScreenProps<DepositParamList, RouteName>;

import { StackScreenProps } from '@react-navigation/stack';

import { DTOBusinessAccount } from '#generated/types';

export enum BusinessAccountRoutes {
  CU = 'CU',
  R = 'R',
}

export type BusinessAccountParamList = {
  [BusinessAccountRoutes.CU]: {
    businessAccount?: DTOBusinessAccount;
    isEdit?: boolean;
  };
  [BusinessAccountRoutes.R]: {
    accountId: string;
  };
};

export type BusinessAccountScreenProps<
  RouteName extends BusinessAccountRoutes,
> = StackScreenProps<BusinessAccountParamList, RouteName>;

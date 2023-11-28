import { StackScreenProps } from '@react-navigation/stack';

import { DTOObserver } from '#generated/types';

export enum ObserversRoutes {
  'VK_CRUD' = 'VK_CRUD',
  'VK_LIST' = 'VK_LIST',
  'VK_ADS_CRUD' = 'VK_ADS_CRUD',
  'VK_ADS_LIST' = 'VK_ADS_LIST',
}

export type ObserversParamList = {
  [ObserversRoutes.VK_CRUD]: {
    observer?: DTOObserver;
  };
  [ObserversRoutes.VK_LIST]: undefined;
  [ObserversRoutes.VK_ADS_CRUD]: {
    observer?: DTOObserver;
  };
  [ObserversRoutes.VK_ADS_LIST]: undefined;
};

export type ObserversScreenProps<RouteName extends ObserversRoutes> =
  StackScreenProps<ObserversParamList, RouteName>;
